import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Clock, Phone, Send, CheckCircle2 } from 'lucide-react';
import { getWhatsAppNumber } from '../services/whatsappService';
import { toast } from '../store/toastStore';

export const Contact = () => {
  const whatsAppPhone = getWhatsAppNumber();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'sm427878@gmail.com').split(',')[0].trim();

    setSubmitting(true);

    if (accessKey) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `[KITSaTOz Contact] ${formData.subject} from ${formData.name}`,
            from_name: 'KITSaTOz Contact Desk',
            to_email: adminEmail,
            replyto: formData.email,
            name: formData.name,
            email: formData.email,
            phone: formData.phone || 'N/A',
            topic: formData.subject,
            message: `
New Contact Inquiry from ${formData.name}
---------------------------------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'N/A'}
Topic: ${formData.subject}

Message:
${formData.message}
---------------------------------------------
`
          })
        });

        const data = await response.json();
        if (!data.success) {
          console.warn('[Web3Forms Warning]:', data.message);
        }
      } catch (err) {
        console.error('Web3Forms dispatch error:', err);
      }
    }

    setSubmitting(false);
    setSubmitted(true);
    toast.success('Message Received!', 'Our engineering support team will respond within 24 hours.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title */}
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">
          Maker Support Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
          Get in Touch With KITSaTOz
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Have questions about an assembly step, need custom CAD adaptation, or want to place a bulk school order? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Contact Info & WhatsApp */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WhatsApp Direct Highlight Box */}
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-emerald-950">Immediate WhatsApp Response</h3>
                <p className="text-xs text-emerald-700">Fastest response for order verification and kit advice</p>
              </div>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Our workshop engineers are on WhatsApp during support hours to advise on gear assembly, CAD files, or custom batch quotes.
            </p>
            <a
              href={`https://wa.me/${whatsAppPhone}?text=Hi%20KITSaTOz!%20I%20have%20an%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Maker on WhatsApp</span>
            </a>
          </div>

          {/* Details list */}
          <div className="bg-white rounded-3xl border border-wood-200/80 p-6 space-y-5 shadow-xs text-xs text-slate-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Workshop Address</p>
                <p className="text-slate-500">KITSaTOz Maker Lab, 4th Floor, Innovation Hub, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Working & Support Hours</p>
                <p className="text-slate-500">Monday to Saturday: 9:30 AM – 7:30 PM (IST)</p>
                <p className="text-[11px] text-slate-400">Closed on Sundays & National Holidays</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Phone & WhatsApp Inquiry</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <a href="tel:+918458877580" className="text-brand-600 hover:text-brand-700 font-semibold">
                    +91 84588 77580
                  </a>
                  <span className="text-slate-300">|</span>
                  <a 
                    href={`https://wa.me/${whatsAppPhone}?text=Hi%20KITSaTOz!%20I%20have%20an%20inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Direct Email</p>
                <a href="mailto:kitsatoz@gmail.com" className="text-slate-600 hover:text-brand-600">
                  kitsatoz@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-wood-200/80 p-6 sm:p-8 shadow-xs">
            
            <h3 className="font-extrabold text-base text-slate-900 mb-6 pb-3 border-b border-wood-100">
              Send us an Inquiry Message
            </h3>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Thank You For Reaching Out!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We have logged your query and an engineer will reply to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="py-2 px-4 rounded-full bg-brand-600 text-white font-bold text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikramaditya"
                      className="w-full px-3 py-2.5 text-xs bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vikram@example.com"
                      className="w-full px-3 py-2.5 text-xs bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full px-3 py-2.5 text-xs bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="General Inquiry">General Kit Inquiry</option>
                      <option value="Custom CAD Prototype">Custom CAD / 3D Print File</option>
                      <option value="Order Status">Order Status & Tracking</option>
                      <option value="Missing Parts Replacement">Missing Part Replacement</option>
                      <option value="Bulk School / Workshop Order">Bulk Educational Order</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Message / Project Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question or CAD specs in detail..."
                    className="w-full p-3 text-xs bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft transition-all disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

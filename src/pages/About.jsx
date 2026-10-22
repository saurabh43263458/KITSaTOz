import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Sparkles, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero section */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          The Story Behind KITSaTOz
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          Where Precision Kinematics Meets Handcrafted Art.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          KITSaTOz was founded by passionate mechanical engineers and woodcraft artisans who believe that assembling a kinetic machine with your own hands is one of life’s purest joys.
        </p>
      </div>

      {/* Visual story banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-3xl border border-wood-200/80 p-8 sm:p-12 shadow-xs">
        <div className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            From Digital Blueprint to Tactile Reality
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every kit begins in CAD: balancing escapements, testing gear teeth clearance, and calibrating gravity counterweights. We test each design over dozens of iteration prototypes before releasing it to makers.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">0.12mm Layer Resolution</h4>
                <p className="text-xs text-slate-500">Fine-tuned additive manufacturing prevents stringing and guarantees velvet-smooth rotation.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-wood-100 text-wood-700 flex items-center justify-center shrink-0">
                <Hammer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Sustainable Baltic Birch</h4>
                <p className="text-xs text-slate-500">FSC certified multi-ply birch sheets laser profiled with sub-millimeter beam focus.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Missing Parts Hotline</h4>
                <p className="text-xs text-slate-500">Dropped a microscopic screw or snapped a gear tooth? We courier replacements free of charge.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-4/3">
          <img
            src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
            alt="Maker Workshop Bench"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-wood-100/60 rounded-3xl p-10 border border-wood-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Build Your First Mechanical Marvel?</h3>
        <p className="text-xs text-slate-600 mb-6 max-w-md mx-auto">
          Explore our beginner to expert kits with step-by-step guides and full hardware included.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft transition-all"
        >
          <span>Browse All Kits</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

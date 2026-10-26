/**
 * WhatsApp Order Message Generator
 * Formats order details and constructs a wa.me URL
 */

export const getWhatsAppNumber = () => {
  return import.meta.env.VITE_WHATSAPP_NUMBER || '918458877580';
};

export const getInquiryNumber = () => {
  return import.meta.env.VITE_INQUIRY_NUMBER || '+91 8458877580';
};

export const getDisplayPhoneNumber = () => {
  return '+91 84588 77580';
};

export const generateWhatsAppOrderUrl = (order) => {
  const phone = getWhatsAppNumber().replace(/[^0-9]/g, '');
  
  const itemsText = order.items
    .map((item, index) => {
      const options = [];
      if (item.selectedMaterial) options.push(`Mat: ${item.selectedMaterial}`);
      if (item.selectedColor) options.push(`Color: ${item.selectedColor}`);
      if (item.selectedAssembly) options.push(`${item.selectedAssembly}`);
      const optStr = options.length > 0 ? ` (${options.join(', ')})` : '';
      return `${index + 1}. *${item.name}* x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}${optStr}`;
    })
    .join('\n');

  const text = `🛠️ *NEW ORDER ENQUIRY - KITSaTOz*
---------------------------------------
📋 *Order ID:* #${order.id}
📅 *Date:* ${new Date(order.createdAt).toLocaleDateString()}

👤 *Customer Details:*
• Name: *${order.customerName}*
• Phone: ${order.phone}
• Email: ${order.email}
• Address: ${order.address}, ${order.pincode}
${order.customizationNotes ? `• Notes/Specs: _${order.customizationNotes}_\n` : ''}
📦 *Ordered Items:*
${itemsText}

💰 *Estimated Total:* *₹${order.totalAmount.toLocaleString()}*
---------------------------------------
💬 _Hello KITSaTOz Team! I have placed this order on your website. Please verify stock, send payment instructions / UPI QR, and advise on delivery schedule._`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

export const generateWhatsAppInquiryUrl = (product, customNote = '') => {
  const phone = getWhatsAppNumber().replace(/[^0-9]/g, '');
  const text = `🛠️ *KITSaTOz Product Inquiry*
---------------------------------------
Product: *${product.name}* (SKU: ${product.id})
Category: ${product.category}
Price: ₹${product.price.toLocaleString()}
${customNote ? `Question / Custom request: ${customNote}\n` : ''}
Hello, I would like to inquire about availability and customization options for this kit!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

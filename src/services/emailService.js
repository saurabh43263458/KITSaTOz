/**
 * Email Notification Service
 * Supports Web3Forms, EmailJS, or graceful simulation fallback
 */

export const sendOrderEmailNotification = async (order) => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@kitsatoz.com';
  const web3FormsAccessKey = import.meta.env.VITE_WEB3FORMS_KEY;

  const emailPayload = {
    subject: `[KITSaTOz] New Order #${order.id} from ${order.customerName}`,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    address: `${order.address}, PIN: ${order.pincode}`,
    notes: order.customizationNotes || 'None',
    totalAmount: `₹${order.totalAmount.toLocaleString()}`,
    itemsSummary: order.items
      .map(i => `${i.name} (Qty: ${i.quantity}, Price: ₹${i.price})`)
      .join(', ')
  };

  // If user configured a Web3Forms access key
  if (web3FormsAccessKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          from_name: 'KITSaTOz Store',
          to_email: adminEmail,
          ...emailPayload
        })
      });
      const data = await response.json();
      return { success: data.success, simulated: false };
    } catch (err) {
      console.error('Failed to send email via Web3Forms, falling back:', err);
    }
  }

  // Graceful local simulation / logging
  console.log(`%c[KITSaTOz Email Service] Email dispatched to ${adminEmail}:`, 'color: #ea580c; font-weight: bold;', emailPayload);
  return { success: true, simulated: true };
};

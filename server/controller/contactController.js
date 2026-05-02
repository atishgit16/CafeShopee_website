// server/controllers/contactController.js
const Contact = require('../models/Contact');

// Send contact message
exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Save to MongoDB
    const newContact = new Contact({
      name,
      email,
      phone: phone || 'N/A',
      subject,
      message
    });

    await newContact.save();
    console.log('✅ Contact message saved to MongoDB:', newContact._id);
    console.log('📩 From:', name, '(', email, ')');
    console.log('📩 Subject:', subject);

    // Optional: Send email (uncomment if you want to use nodemailer)
    // await sendEmailNotification(newContact);

    res.status(201).json({
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: newContact
    });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};

// Get all contact messages (admin only)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to retrieve messages' });
  }
};

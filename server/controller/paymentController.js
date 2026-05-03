// server/controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    
    console.log('💳 Creating payment intent for amount:', amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });

    console.log('✅ Payment intent created:', paymentIntent.id);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('❌ Stripe error:', error);
    res.status(500).json({ 
      message: error.message || 'Payment processing failed' 
    });
  }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Confirm with payment method if provided
    if (paymentMethodId) {
      const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });
      return res.json({
        status: confirmedIntent.status,
        paymentIntent: confirmedIntent
      });
    }

    res.json({
      status: paymentIntent.status,
      paymentIntent: paymentIntent
    });
  } catch (error) {
    console.error('❌ Stripe confirm error:', error);
    res.status(500).json({ message: error.message || 'Payment confirmation failed' });
  }
};

// Create payment intent without confirm (for use with elements)
exports.createPaymentIntentWithoutConfirm = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('❌ Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
};
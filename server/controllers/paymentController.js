const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe needs paise (cents)
      currency: 'inr',
      metadata: { userId: req.user._id.toString() },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

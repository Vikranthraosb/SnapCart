// routes/web/payment.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const PaymentDetail = require('../../models/payment-detail');
const Donation = require('../../models/donation');
const { nanoid } = require('nanoid');

let razorPayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.get('/', function(req, res, next) {
  // Render form for accepting amount
  res.render('pages/payment/order', { 
    title: 'Donate for Animals'
  });
});

router.post('/order', async function(req, res, next) {
  const selectedAmount = req.body.amount;

  // Validate if the selectedAmount is valid (you can add more validation as needed)
  if (![10, 50, 100].includes(parseInt(selectedAmount))) {
    return res.render('pages/error', {
      title: 'Invalid Amount',
      status: 400,
      message: 'Invalid amount selected.',
    });
  }

  params = {
    amount: selectedAmount * 100,
    currency: 'INR',
    receipt: nanoid(),
    payment_capture: '1',
  };

  razorPayInstance.orders
    .create(params)
    .then(async (response) => {
      const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
      const paymentDetail = new PaymentDetail({
        orderId: response.id,
        receiptId: response.receipt,
        amount: response.amount / 100,
        currency: response.currency,
        createdAt: response.created_at,
        status: response.status,
      });

      // Save the payment details to PaymentDetail collection
      await paymentDetail.save();

      // Create a new donation record
      const donation = new Donation({
        amount: selectedAmount,
        createdAt: new Date(),
        status: 'pending',
      });

      // Save the donation details to the Donation collection
      await donation.save();

      res.render('pages/payment/checkout', {
        title: 'Confirm Order',
        razorpayKeyId: razorpayKeyId,
        paymentDetail: paymentDetail,
        donation: donation,
      });
    })
    .catch((err) => {
      // Handle error
      res.render('pages/error', {
        title: 'Order Creation Failed',
        status: 500,
        message: 'Failed to create order.',
      });
    });
});

router.post('/verify', async function(req, res, next) {
  body = req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id;
  let crypto = require('crypto');
  let expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === req.body.razorpay_signature) {
    await PaymentDetail.findOneAndUpdate(
      { orderId: req.body.razorpay_order_id },
      {
        paymentId: req.body.razorpay_payment_id,
        signature: req.body.razorpay_signature,
        status: 'paid',
      },
      { new: true },
      async function(err, doc) {
        if (err) {
          throw err;
        }

        // Update the status of the associated donation
        const donationId = doc.donationId;
        await Donation.findByIdAndUpdate(donationId, {
          status: 'paid',
        });

        res.render('pages/payment/success', {
          title: 'Payment verification successful',
          paymentDetail: doc,
        });
      }
    );
  } else {
    res.render('pages/payment/fail', {
      title: 'Payment verification failed',
    });
  }
});

module.exports = router;

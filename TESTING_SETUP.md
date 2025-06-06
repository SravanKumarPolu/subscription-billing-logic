# Payment Testing Setup Guide

This guide will help you set up PayPal Sandbox and Stripe Test environments for testing payments in your subscription billing application.

## 🔹 PayPal Sandbox Setup

### Step 1: Create Developer Account
1. Go to: [https://developer.paypal.com](https://developer.paypal.com)
2. Log in with your PayPal account or create a new one
3. Accept the developer agreement

### Step 2: Create Sandbox Accounts
1. Navigate to: **Dashboard → Sandbox → Accounts**
2. Create **two types of accounts**:

#### ✅ Sandbox Business Account (Merchant)
- **Type**: Business
- **Purpose**: This represents your application/merchant account
- **Usage**: Receives payments from customers

#### ✅ Sandbox Personal Account (Customer)
- **Type**: Personal
- **Purpose**: Acts as a test customer
- **Usage**: Makes payments during testing

**Example Test Customer Credentials:**
```
Email: sb-xyz123456789@personal.example.com
Password: Test@1234
Login URL: https://www.sandbox.paypal.com/
```

### Step 3: Get API Credentials
1. Go to: **My Apps & Credentials → Create App**
2. Fill in the details:
   - **App Name**: Your app name (e.g., "Subscription Billing App")
   - **Merchant**: Select your sandbox business account
   - **Features**: Check "Accept Payments"
3. **Copy your credentials**:
   - `Client ID`
   - `Client Secret`

### Step 4: Environment Variables
Add these to your `.env.local` file:
```env
PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret_here
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_BASE_URL=https://api.sandbox.paypal.com
PAYPAL_TEST_CUSTOMER_EMAIL=sb-xyz123456789@personal.example.com
PAYPAL_TEST_CUSTOMER_PASSWORD=Test@1234
```

### Step 5: Test Payment Flow
1. Use the "Test PayPal Billing" button in your dashboard
2. For manual testing, log in to [https://www.sandbox.paypal.com/](https://www.sandbox.paypal.com/) with your test customer credentials
3. Complete the payment flow using the test account

---

## ✅ Stripe Test Setup

### Step 1: Create Developer Account
1. Go to: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Sign up for a free developer account
3. Verify your email address

### Step 2: Enable Test Mode
1. In the Stripe Dashboard, toggle **"Test Mode"** in the top-left corner
2. Ensure you see "Test Mode" indicator in the navigation

### Step 3: Get Test API Keys
1. Navigate to: **Developers → API Keys**
2. **Copy your test keys**:
   - `Publishable Key` (starts with `pk_test_`)
   - `Secret Key` (starts with `sk_test_`)

### Step 4: Environment Variables
Add these to your `.env.local` file:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 5: Test Cards
Use these test card numbers for different scenarios:

#### ✅ Successful Payment
```
Card Number: 4242 4242 4242 4242
Expiry: 12/34
CVV: 123
ZIP: 10001
```

#### ❌ Declined Card
```
Card Number: 4000 0000 0000 0002
Expiry: 12/34
CVV: 123
ZIP: 10001
```

#### ❌ Insufficient Funds
```
Card Number: 4000 0000 0000 9995
Expiry: 12/34
CVV: 123
ZIP: 10001
```

#### 🔒 3D Secure Authentication
```
Card Number: 4000 0027 6000 3184
Expiry: 12/34
CVV: 123
ZIP: 10001
```

### Step 6: Test Payment Flow
1. Use the "Test Stripe Payment" button in your dashboard
2. For manual testing, use the test card numbers above
3. View test transactions in your [Stripe Test Dashboard](https://dashboard.stripe.com/test/payments)

---

## 🔁 General Configuration

### Application Settings
Add these to your `.env.local` file:
```env
# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
TEST_MODE=true

# Database (if using)
DATABASE_URL=your_database_connection_string
```

### Test Mode Features
When `TEST_MODE=true`:
- All payments are simulated
- No real money is charged
- Test credentials are displayed in the dashboard
- Mock responses are used for testing scenarios

---

## 🧪 Testing Best Practices

### 1. Always Use Test Environments
- **PayPal**: Use sandbox environment only
- **Stripe**: Enable test mode in dashboard
- **Never mix**: Keep test and production data separate

### 2. Test Different Scenarios
- ✅ Successful payments
- ❌ Failed payments (declined cards, insufficient funds)
- 🔄 Network timeouts and errors
- 💰 Different amounts and currencies

### 3. Monitor Test Transactions
- **PayPal**: Check sandbox transaction history
- **Stripe**: View test dashboard for payment details
- **Application**: Check console logs and database records

### 4. Clear Test Data Regularly
- Reset test accounts periodically
- Clear old test transactions
- Keep test environments clean

---

## 📚 Additional Resources

### PayPal Documentation
- [PayPal Developer Guide](https://developer.paypal.com/docs/)
- [Sandbox Testing](https://developer.paypal.com/docs/api-basics/sandbox/)
- [REST API Reference](https://developer.paypal.com/docs/api/overview/)

### Stripe Documentation
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Test Card Numbers](https://stripe.com/docs/testing#cards)
- [API Documentation](https://stripe.com/docs/api)

### Your Application
- Visit `/api/test-credentials` to get current test credentials
- Use the dashboard's test credentials section for easy access
- Check the browser console for detailed payment logs

---

## 🚨 Security Notes

### Environment Variables
- **Never commit** `.env.local` to version control
- Use different credentials for development/staging/production
- Rotate API keys regularly

### Test vs Production
- Always double-check which environment you're using
- Use clear indicators in your UI for test mode
- Implement proper environment switching mechanisms

### API Keys
- Keep secret keys secure and private
- Use environment variables, not hardcoded values
- Implement proper access controls and monitoring 
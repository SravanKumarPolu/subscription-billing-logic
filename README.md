# Subscription Billing Logic Dashboard

A comprehensive subscription billing management system built with Next.js, featuring automated billing processes, wallet integration, and PayPal payment handling.

## 🌐 Live Demo

**Production URL:** [https://silver-hummingbird-b2c408.netlify.app](https://silver-hummingbird-b2c408.netlify.app)

## ✨ Features

### 💳 Billing Dashboard
- **Real-time Wallet Balance** - Track available credits ($25.50)
- **Next Billing Preview** - See upcoming payments (01/02/2024 - $29.99)
- **Subscription Status** - Monitor active subscriptions (plan_premium)
- **Payment Method Intelligence** - Automatic wallet + PayPal combination
- **Manual Billing Trigger** - Test billing processes manually

### 🔄 Automated Payment Logic
- **Hybrid Payment System** - Uses wallet credits first, then PayPal for remaining balance
- **Smart Payment Routing** - Automatically determines optimal payment method
- **Transaction Processing** - Complete billing workflow with error handling
- **Real-time Balance Updates** - Wallet balance updates after successful transactions

### 🎨 Modern UI/UX
- **Clean Dashboard Design** - Professional billing interface
- **Responsive Layout** - Works on desktop and mobile devices
- **Real-time Updates** - Dynamic status and balance updates
- **Intuitive Navigation** - Easy-to-use billing controls

## 🚀 Technology Stack

- **Frontend:** Next.js 15.2.4, React, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Payment:** PayPal Integration
- **Deployment:** Netlify with automatic deployments
- **Version Control:** Git/GitHub

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/SravanKumarPolu/subscription-billing-logic.git
   cd subscription-billing-logic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your PayPal and other API credentials.

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📋 API Endpoints

### Billing Management
- `POST /api/billing/process` - Process subscription billing
- `GET /api/subscriptions/due` - Get due subscriptions
- `GET /api/subscriptions/[userId]` - Get user subscription details

### Wallet Operations
- `GET /api/wallet/[userId]` - Get wallet balance
- `POST /api/wallet/deduct` - Deduct from wallet

### Payment Processing
- `POST /api/paypal/charge` - Process PayPal payments
- `POST /api/transactions` - Record transactions

### Notifications
- `POST /api/notifications/billing-success` - Success notifications
- `POST /api/notifications/billing-failure` - Failure notifications

## 💰 Payment Flow

1. **Payment Calculation**
   - Check wallet balance vs. subscription amount
   - Determine payment method (Wallet Only, PayPal Only, or Hybrid)

2. **Transaction Processing**
   - Deduct available amount from wallet
   - Charge remaining balance to PayPal
   - Update wallet balance and subscription status

3. **Result Handling**
   - Send success/failure notifications
   - Update transaction records
   - Refresh dashboard data

## 🏗️ Project Structure

```
subscription-billing-logic/
├── app/
│   ├── api/                 # API routes
│   │   ├── billing/         # Billing logic
│   │   ├── wallet/          # Wallet operations
│   │   ├── paypal/          # PayPal integration
│   │   └── transactions/    # Transaction handling
│   ├── billing/             # Billing page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage (Dashboard)
├── components/              # Reusable components
├── lib/                     # Utility functions
├── public/                  # Static assets
├── styles/                  # Additional styles
├── types/                   # TypeScript type definitions
├── netlify.toml            # Netlify configuration
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json            # Dependencies and scripts
```

## 🌟 Key Features Explained

### Smart Payment Logic
```typescript
// Automatically determines best payment method
if (walletBalance >= subscriptionAmount) {
  // Use wallet only
  method = "Wallet Only"
} else if (walletBalance > 0) {
  // Use wallet + PayPal combination
  method = "Wallet + PayPal" 
} else {
  // Use PayPal only
  method = "PayPal Only"
}
```

### Real-time Dashboard Updates
- Wallet balance updates immediately after transactions
- Payment preview adjusts based on current wallet balance
- Subscription status reflects real-time changes

## 🚀 Deployment

### Netlify Deployment (Automatic)
The project is configured for automatic deployment on Netlify:

1. **Connect Repository** - Link your GitHub repo to Netlify
2. **Build Settings** - Automatically detected from `netlify.toml`
3. **Deploy** - Automatic deployments on every push to main branch

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod
```

## 🔐 Environment Variables

Create a `.env.local` file with:

```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Sravan Kumar Polu**
- GitHub: [@SravanKumarPolu](https://github.com/SravanKumarPolu)
- Project Link: [https://github.com/SravanKumarPolu/subscription-billing-logic](https://github.com/SravanKumarPolu/subscription-billing-logic)

## 🎯 Future Enhancements

- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] Email notification system
- [ ] Subscription plan management
- [ ] Customer portal
- [ ] Invoice generation
- [ ] Refund processing
- [ ] Payment method management

## 🐛 Known Issues

- PayPal integration requires production credentials for live payments
- Cross-origin requests need proper CORS configuration for production

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainer.

---

**⭐ If you find this project useful, please give it a star on GitHub!** 
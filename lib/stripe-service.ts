export class StripeService {
  private publishableKey: string
  private secretKey: string
  private isTestMode: boolean

  constructor() {
    this.publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_default'
    this.secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_default'
    this.isTestMode = process.env.TEST_MODE === 'true' || process.env.NODE_ENV !== 'production'
  }

  async chargeCustomer(amount: number, currency: string = 'usd', paymentMethodId?: string): Promise<any> {
    if (this.isTestMode) {
      console.log(`🧪 TEST MODE: Simulating Stripe charge of ${currency.toUpperCase()} ${amount}`)
      
      // Simulate test card behaviors
      const testScenarios = [
        { success: true, rate: 0.85, card: '4242424242424242' }, // Success
        { success: false, rate: 0.10, error: 'card_declined', card: '4000000000000002' }, // Declined
        { success: false, rate: 0.05, error: 'insufficient_funds', card: '4000000000009995' }, // Insufficient funds
      ]
      
      const random = Math.random()
      let scenario = testScenarios[0] // default success
      
      let cumulative = 0
      for (const s of testScenarios) {
        cumulative += s.rate
        if (random < cumulative) {
          scenario = s
          break
        }
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (scenario.success) {
        return {
          id: `pi_test_${Date.now()}`,
          status: 'succeeded',
          amount: amount * 100, // Stripe uses cents
          currency: currency.toLowerCase(),
          payment_method: {
            id: paymentMethodId || `pm_test_${Date.now()}`,
            card: {
              brand: 'visa',
              last4: scenario.card.slice(-4),
              exp_month: 12,
              exp_year: 2034
            }
          },
          created: Math.floor(Date.now() / 1000),
          test_mode: true
        }
      } else {
        throw new Error(`Stripe test error: ${scenario.error}`)
      }
    }

    // Real Stripe API call for production
    try {
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: (amount * 100).toString(), // Convert to cents
          currency: currency.toLowerCase(),
          payment_method: paymentMethodId || '',
          confirm: 'true',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Stripe payment failed: ${error.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Stripe payment error:', error)
      throw error
    }
  }

  async createPaymentMethod(cardData: any): Promise<any> {
    if (this.isTestMode) {
      console.log('🧪 TEST MODE: Creating Stripe payment method')
      
      return {
        id: `pm_test_${Date.now()}`,
        type: 'card',
        card: {
          brand: 'visa',
          last4: cardData.number?.slice(-4) || '4242',
          exp_month: cardData.exp_month || 12,
          exp_year: cardData.exp_year || 2034
        },
        test_mode: true
      }
    }

    // Real Stripe API call for production
    try {
      const response = await fetch('https://api.stripe.com/v1/payment_methods', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          type: 'card',
          'card[number]': cardData.number,
          'card[exp_month]': cardData.exp_month.toString(),
          'card[exp_year]': cardData.exp_year.toString(),
          'card[cvc]': cardData.cvc
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Stripe payment method creation failed: ${error.error?.message}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Stripe payment method error:', error)
      throw error
    }
  }

  getTestCards() {
    return {
      success: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2034,
        cvc: '123',
        description: 'Successful payment'
      },
      declined: {
        number: '4000000000000002',
        exp_month: 12,
        exp_year: 2034,
        cvc: '123',
        description: 'Card declined'
      },
      insufficient_funds: {
        number: '4000000000009995',
        exp_month: 12,
        exp_year: 2034,
        cvc: '123',
        description: 'Insufficient funds'
      },
      require_3ds: {
        number: '4000000000003220',
        exp_month: 12,
        exp_year: 2034,
        cvc: '123',
        description: 'Requires 3D Secure authentication'
      },
      processing_error: {
        number: '4000000000000119',
        exp_month: 12,
        exp_year: 2034,
        cvc: '123',
        description: 'Processing error'
      }
    }
  }

  getTestCredentials() {
    if (!this.isTestMode) {
      return null
    }

    return {
      environment: 'test',
      publishableKey: this.publishableKey,
      testCards: this.getTestCards(),
      dashboardUrl: 'https://dashboard.stripe.com/test/payments'
    }
  }
} 
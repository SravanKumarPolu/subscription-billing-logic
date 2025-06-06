export class PayPalService {
  private clientId: string
  private clientSecret: string
  private baseUrl: string
  private isTestMode: boolean

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || 'sandbox_client_id'
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'sandbox_client_secret'
    this.baseUrl = process.env.PAYPAL_BASE_URL || 'https://api.sandbox.paypal.com'
    this.isTestMode = process.env.TEST_MODE === 'true' || process.env.NODE_ENV !== 'production'
  }

  async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
      
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
      })

      if (!response.ok) {
        throw new Error(`PayPal auth failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('PayPal authentication error:', error)
      throw error
    }
  }

  async chargeCustomer(amount: number, currency: string = 'USD'): Promise<any> {
    if (this.isTestMode) {
      console.log(`🧪 TEST MODE: Simulating PayPal charge of ${currency} ${amount}`)
      
      // Simulate different test scenarios
      const testScenarios = [
        { success: true, rate: 0.9 }, // 90% success rate
        { success: false, rate: 0.1, error: 'Insufficient funds' }, // 10% failure
      ]
      
      const random = Math.random()
      let scenario = testScenarios[0] // default success
      
      for (const s of testScenarios) {
        if (random < s.rate) {
          scenario = s
          break
        }
      }

      if (scenario.success) {
        return {
          id: `PAYPAL_TEST_${Date.now()}`,
          status: 'COMPLETED',
          amount: {
            currency_code: currency,
            value: amount.toFixed(2)
          },
          payer: {
            email_address: process.env.PAYPAL_TEST_CUSTOMER_EMAIL || 'sb-test@personal.example.com',
            name: {
              given_name: 'Test',
              surname: 'Customer'
            }
          },
          create_time: new Date().toISOString(),
          update_time: new Date().toISOString(),
          test_mode: true
        }
      } else {
        throw new Error(scenario.error || 'PayPal test payment failed')
      }
    }

    // Real PayPal API call for production
    try {
      const accessToken = await this.getAccessToken()
      
      const paymentData = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2)
          },
          description: 'Subscription payment'
        }],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
          brand_name: 'Subscription Billing',
          user_action: 'PAY_NOW'
        }
      }

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        throw new Error(`PayPal payment failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('PayPal payment error:', error)
      throw error
    }
  }

  async capturePayment(orderId: string): Promise<any> {
    if (this.isTestMode) {
      console.log(`🧪 TEST MODE: Capturing PayPal order ${orderId}`)
      return {
        id: orderId,
        status: 'COMPLETED',
        capture_time: new Date().toISOString(),
        test_mode: true
      }
    }

    try {
      const accessToken = await this.getAccessToken()
      
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`PayPal capture failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('PayPal capture error:', error)
      throw error
    }
  }

  getTestCredentials() {
    if (!this.isTestMode) {
      return null
    }

    return {
      environment: 'sandbox',
      testCustomer: {
        email: process.env.PAYPAL_TEST_CUSTOMER_EMAIL || 'sb-xyz123456789@personal.example.com',
        password: process.env.PAYPAL_TEST_CUSTOMER_PASSWORD || 'Test@1234',
        loginUrl: 'https://www.sandbox.paypal.com/'
      },
      testCards: {
        visa: '4032039604289826',
        mastercard: '5474061040746389',
        amex: '374245455400001'
      }
    }
  }
} 
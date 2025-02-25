import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
  });

  async createCheckoutSession(contractId: string, amount: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: '프리랜서 계약' },
            unit_amount: parseFloat(amount) * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/contracts/${contractId}/success`,
      cancel_url: `http://localhost:3000/contracts/${contractId}/cancel`,
    });

    return { url: session.url };
  }
}

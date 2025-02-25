import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '@packages/common';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async createCheckout(@Body() body: { contractId: string; amount: string }) {
    return this.stripeService.createCheckoutSession(body.contractId, body.amount);
  }
}

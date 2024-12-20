import { PaymeError } from '@enums';
import { TransactionException } from '@exceptions';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decode } from 'base-64';

@Injectable()
export class PaymeGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id } = request.body;
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
      throw new TransactionException(PaymeError.InvalidAuthorization, id);

    const data = decode(token);
    const PAYME_MERCHANT_KEY =
      this.configService.getOrThrow<string>('payme.merchantKey');
console.log(PAYME_MERCHANT_KEY)
    if (!data.includes(PAYME_MERCHANT_KEY)) {
      throw new TransactionException(PaymeError.InvalidAuthorization, id);
    }
    return true;
  }
}

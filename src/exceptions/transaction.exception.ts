import { HttpException } from '@nestjs/common';

export class TransactionException extends HttpException {
  constructor(
    transactionError: Record<string, any>,
    transactionId: number,
    data?: any,
  ) {
    super(
      {
        message: transactionError.message,
        data: data,
        transactionId,
        isTransactionException: true,
      },
      transactionError.code,
    );
  }
}

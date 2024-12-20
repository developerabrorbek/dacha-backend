import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(exception);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (exceptionResponse['isTransactionException']) {
        return response.status(200).json({
          error: {
            code: status,
            message: exceptionResponse['message'],
            data: exceptionResponse['data'],
          },
          id: exceptionResponse['transactionId'],
        });
      }

      return response.status(status).json({
        timestamp: new Date().toISOString(),
        ...(exception.getResponse() as object),
      });
    }

    response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      message: 'Internal server error',
    });
  }
}

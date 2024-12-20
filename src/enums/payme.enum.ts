export enum PaymeMethod {
  CheckPerformTransaction = 'CheckPerformTransaction',
  CheckTransaction = 'CheckTransaction',
  CreateTransaction = 'CreateTransaction',
  PerformTransaction = 'PerformTransaction',
  CancelTransaction = 'CancelTransaction',
  GetStatement = 'GetStatement',
}

export const PaymeError = {
  InvalidAmount: {
    name: 'InvalidAmount',
    code: -31001,
    message: {
      uz: "Noto'g'ri summa",
      ru: 'Недопустимая сумма',
      en: 'Invalid amount',
    },
  },
  UserNotFound: {
    name: 'UserNotFound',
    code: -31050,
    message: {
      uz: 'Biz sizning hisobingizni topolmadik.',
      ru: 'Мы не нашли вашу учетную запись',
      en: "We couldn't find your account",
    },
  },
  OrderNotFound: {
    name: 'OrderNotFound',
    code: -31050,
    message: {
      uz: 'Biz buyurtmani topolmadik.',
      ru: 'Нам не удалось найти заказ.',
      en: 'We could not find the order.',
    },
  },
  CantDoOperation: {
    name: 'CantDoOperation',
    code: -31008,
    message: {
      uz: 'Biz operatsiyani bajara olmaymiz',
      ru: 'Мы не можем сделать операцию',
      en: "We can't do operation",
    },
  },
  TransactionNotFound: {
    name: 'TransactionNotFound',
    code: -31003,
    message: {
      uz: 'Tranzaktsiya topilmadi',
      ru: 'Транзакция не найдена',
      en: 'Transaction not found',
    },
  },
  AlreadyDone: {
    name: 'AlreadyDone',
    code: -31060,
    message: {
      uz: "Mahsulot uchun to'lov qilingan",
      ru: 'Оплачено за товар',
      en: 'Paid for the product',
    },
  },
  Pending: {
    name: 'Pending',
    code: -31050,
    message: {
      uz: "Buyurtma uchun to'lov kutilayapti",
      ru: 'Ожидается оплата заказ',
      en: 'Payment for the order is pending',
    },
  },
  InvalidAuthorization: {
    name: 'InvalidAuthorization',
    code: -32504,
    message: {
      uz: 'Avtorizatsiya yaroqsiz',
      ru: 'Авторизация недействительна',
      en: 'Authorization invalid',
    },
  },
  MethodNotFound: {
    name: "MethodNotFound",
    code: -32601,
    message: {
        uz: "Method topilmadi",
        ru: "Метод не найден",
        en: "Method not found",
    }
  }
};

export enum PaymeData {
  UserId = 'user_id',
  OrderId = 'order_id',
}

export enum TransactionState {
  Paid = 2,
  Pending = 1,
  PendingCanceled = -1,
  PaidCanceled = -2,
}

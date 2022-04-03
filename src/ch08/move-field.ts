function dateToday() {
  return new Date(Date.now());
}

export class Customer {
  _name: string;
  _discountRate: number;
  _contract: CustomerContract;

  constructor(name: string, discountRate: number) {
    this._name = name;
    this._discountRate = discountRate;
    this._contract = new CustomerContract(dateToday());
  }

  get discountRate() {
    return this._discountRate;
  }

  becomePreferred() {
    this._discountRate += 0.03;
  }
}

class CustomerContract {
  _startDate: Date;
  constructor(startDate: Date) {
    this._startDate = startDate;
  }
}

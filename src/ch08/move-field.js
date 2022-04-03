function dateToday() {
  return new Date(Date.now());
}

class Customer {
  constructor(name, discountRate) {
    this._name = name;
    this._setDiscountRate(discountRate);
    this._contract = new CustomerContract(dateToday());
  }

  get discountRate() {
    return this._discountRate;
  }

  _setDiscountRate(n) {
    this._discountRate = n;
  }

  becomePreferred() {
    this._discountRate += 0.03;
  }
}

class CustomerContract {
  constructor(startDate) {
    this._startDate = startDate;
  }
}

import { IBuyer, IBuyerValidation, PaymentMethod } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  protected buyerData: IBuyer;

  constructor(protected events: EventEmitter, initialData?: Partial<IBuyer>) {
    this.buyerData = {
      payment: initialData?.payment ?? PaymentMethod.Null,
      address: initialData?.address ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
    };
  }

  saveData(patch: Partial<IBuyer>): void {
    this.buyerData = { ...this.buyerData, ...patch };
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.buyerData);
    }
  }

  getData(): IBuyer {
    return this.buyerData;
  }

  clearData() {
    this.buyerData = {} as IBuyer;
  }

  validateOrder() {
    const errors: IBuyerValidation = {} as IBuyerValidation;

    if (!this.buyerData.payment || this.buyerData.payment === ("" as PaymentMethod)) {
      errors.payment = "Выберите способ оплаты";
    }

    if (!this.buyerData.address) {
      errors.address = "Введите корректный адрес";
    }

    if (!this.buyerData.email) {
      errors.email = "Введите корректный e-mail";
    }

    if (!this.buyerData.phone) {
      errors.phone = "Введите корректный телефон";
    }

    this.events.emit('formErrors:change', errors)
    return Object.keys(errors).length === 0;
  }

}

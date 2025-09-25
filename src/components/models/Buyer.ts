import { IBuyer, IBuyerValidation, PaymentMethod } from "../../types";

export class Buyer {
  protected buyerData: IBuyer;

  constructor(initialData?: Partial<IBuyer>) {
    this.buyerData = {
      payment: initialData?.payment ?? PaymentMethod.Card,
      address: initialData?.address ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
    };
  }

  saveData(patch: Partial<IBuyer>): void {
    this.buyerData = { ...this.buyerData, ...patch };
    //this.events.emit('items:changed');
  }

  getData(): IBuyer {
    return this.buyerData;
  }

  clearData() {
    this.buyerData = {} as IBuyer;
    //this.events.emit('items:changed');
  }

  validateData(): IBuyerValidation {
    const validationData: IBuyerValidation = {} as IBuyerValidation;

    if (!this.buyerData.address) {
      validationData.address = "Введите корректный адрес.";
    }

    if (!this.buyerData.email) {
      validationData.email = "Введите корректный e-mail.";
    }

    if (!this.buyerData.phone) {
      validationData.phone = "Введите корректный телефон.";
    }

    if (this.buyerData.payment === "") {
      validationData.payment = "Выберите способ оплаты";
    }

    return validationData;
  }
}

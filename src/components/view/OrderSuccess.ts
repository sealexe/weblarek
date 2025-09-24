import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IOrderSuccess {
  amount: number;
}

export class OrderSuccsee extends Component<IOrderSuccess> {
  protected orderAmount: HTMLElement;
  protected successButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.orderAmount = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
  }

  set amount(value: number) {
    this.setText(this.orderAmount, `Списано ${value} синапсов`);
  }
}

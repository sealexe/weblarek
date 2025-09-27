import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IOrderSuccess {
  amount: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected orderAmount: HTMLElement;
  protected successButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this.orderAmount = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.successButton.addEventListener('click', () => events.emit('order:end'));
  }

  set amount(value: number) {
    this.setText(this.orderAmount, `Списано ${value} синапсов`);
  }
}

import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IBasket {
  basketList: HTMLElement[];
  basketEmptyElement: HTMLElement;
  total: number;
  disabled: string;
  abled: string;
}

export class Basket extends Component<IBasket> {
  protected basketContainer: HTMLElement;
  protected totalPrice: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this.basketContainer = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.basketButton.addEventListener('click', () => this.events.emit('order:open'))
  }

  set basketEmptyElement(value: HTMLElement) {
    this.basketContainer.replaceChildren(value);
  }

  set basketList(items: HTMLElement[]) {
    this.basketContainer.replaceChildren(...items);
  }

  set total(value: number) {
    this.setText(this.totalPrice, `${value} синапсов`);
  }

  set disabled(value: string) {
    this.basketButton.setAttribute(value, value);
  }

  set abled(value: string) {
    this.basketButton.removeAttribute(value);
  }
}

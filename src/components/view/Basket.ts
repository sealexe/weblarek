import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IBasket {
  basketList: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected basketContainer: HTMLElement;
  protected totalPrice: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.basketContainer = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
  }

  set basketList(items: HTMLElement[]) {
    this.basketContainer.replaceChildren(...items);
  }

  set total(value: number) {
    this.setText(this.totalPrice, `${value} синапсов`);
  }
}

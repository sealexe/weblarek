import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IBaseCard {
  title: string;
  price: number | null | string;
}

export class BaseCard<T extends IBaseCard> extends Component<T> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set title(value: string) {
    this.setText(this.cardTitle, value);
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this.cardPrice, "Бесценно");
    } else {
      this.setText(this.cardPrice, `${value} синапсов`);
    }
  }
}

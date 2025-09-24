import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IBaseCard {
  title: string;
  price: number | null | undefined;
}

export class BaseCard<T extends IBaseCard> extends Component<T> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(data: string){
    this.setText(this.cardTitle, data);
  }

  set price(value: number) {
    this.setText(this.cardPrice, `${value} синапсов`);
  }
}

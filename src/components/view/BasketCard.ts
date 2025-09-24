import { ensureElement } from "../../utils/utils";
import { BaseCard, IBaseCard } from "./BaseCard";

interface IBasketCard extends IBaseCard {
  index: number;
}

export class BasketCard extends BaseCard<IBasketCard> {
  protected basketDeleteButton: HTMLButtonElement;
  protected itemIndex: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.basketDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    this.itemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
  }

  set index(value: number) {
      this.setText(this.itemIndex, value);
    }

}

import { ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { BaseCard, IBaseCard } from "./BaseCard";

interface IBasketCard extends IBaseCard {
  index: number;
}

export class BasketCard extends BaseCard<IBasketCard> {
  protected basketDeleteButton: HTMLButtonElement;
  protected itemIndex: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.basketDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    this.itemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);

    if (actions?.onClick) {
      this.basketDeleteButton.addEventListener('click', actions.onClick);
    }

    // this.basketDeleteButton.addEventListener('click', () => this.events.emit('product:delete', {id: this.itemId}));
  }

  set index(value: number) {
      this.setText(this.itemIndex, value);
    }


}

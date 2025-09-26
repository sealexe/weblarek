import { ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { CatalogCard, ICatalogCard } from "./CatalogCard";

interface IPrewiewCard extends ICatalogCard {
  description: string;
  buttonText: string;
  attribute: string;
}

export class PreviewCard extends CatalogCard<IPrewiewCard> {
  protected cardDescription: HTMLElement;
  protected addDeleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
    this.addDeleteButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.addClick) {
      this.addDeleteButton.addEventListener('click', actions.addClick);
    }

    // if (actions?.delClick) {
    //   this.addDeleteButton.addEventListener('click', actions.delClick);
    // }

  }

  set description(value: string) {
    this.setText(this.cardDescription, value);
  }

  set buttonText(value: string) {
    this.setText(this.addDeleteButton, value);
  }

  set attribute(value: string) {
    this.addDeleteButton.setAttribute(value, value);
    this.setText(this.addDeleteButton, 'Недоступно');
  }
}

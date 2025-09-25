import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { CatalogCard, ICatalogCard } from "./CatalogCard";

interface IPrewiewCard extends ICatalogCard {
  description: string;
}

export class PreviewCard extends CatalogCard<IPrewiewCard> {
  protected cardDescription: HTMLElement;
  protected addDeleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
    this.addDeleteButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.addDeleteButton.addEventListener('click', () => this.events.emit('product:add'));
  }

  set description(data: string) {
    this.setText(this.cardDescription, data);
  }
}

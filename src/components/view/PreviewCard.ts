import { ensureElement } from "../../utils/utils";
import { CatalogCard, ICatalogCard } from "./CatalogCard";

interface IPrewiewCard extends ICatalogCard {
  description: string;
}

export class PreviewCard extends CatalogCard<IPrewiewCard> {
  protected cardDescription: HTMLElement;
  protected addDeleteButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
    this.addDeleteButton = ensureElement<HTMLButtonElement>('.card__text', this.container);
  }

  set description(data: string) {
    this.setText(this.cardDescription, data);
  }
}

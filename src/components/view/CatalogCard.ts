import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { BaseCard, IBaseCard } from "./BaseCard";

type CategoryKey = keyof typeof categoryMap;

export interface ICatalogCard extends IBaseCard {
  image: string;
  category: string;
}

export class CatalogCard<T extends ICatalogCard> extends BaseCard<T> {
  protected cardImage: HTMLImageElement;
  protected cardCategory: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.gallery__item', this.container);

    this.cardImage.addEventListener('click', () => this.events.emit('modal:open'));

  }

  set image(value: string) {
    this.setImage(this.cardImage, CDN_URL + value.replace('svg', 'png'));
  }

  set category(value: string) {
    this.setText(this.cardCategory, value);

    for (const key in categoryMap) {
      this.cardCategory.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
}



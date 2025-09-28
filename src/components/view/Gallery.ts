import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IGallery {
  catalog: HTMLElement[];
  locked: boolean;
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = ensureElement<HTMLElement>(
      ".gallery",
      this.container
    );
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }

  set locked(value: boolean) {
    if (value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

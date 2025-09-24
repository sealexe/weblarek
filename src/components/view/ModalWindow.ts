import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IModalWindow {
  content: HTMLElement;
}

export class ModalWindow extends Component<IModalWindow> {
  protected modalContainer: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.modalContainer = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
  }

  set content(data: HTMLElement) {
    this.modalContainer.append(data);
  }
}

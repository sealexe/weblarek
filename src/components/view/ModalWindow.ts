import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IModalWindow {
  content: HTMLElement;
}

export class ModalWindow extends Component<IModalWindow> {
  protected modalContainer: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this.modalContainer = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => this.events.emit('modal:visible'));
  }

  set content(value: HTMLElement) {
    this.modalContainer.replaceChildren(value);
  }
}

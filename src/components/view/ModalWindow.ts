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
    this.modalContainer = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );

    this.closeButton.addEventListener("click", () => this.close.bind(this));
    this.container.addEventListener("click", this.close.bind(this));
    this.modalContainer.addEventListener("click", (e) => e.stopPropagation());
  }

  set content(value: HTMLElement) {
    this.modalContainer.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
    this.container.style.overflowY = 'auto'
    this.modalContainer.style.overflowY = 'visible';

    this.events.emit("modal:open");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.modalContainer.style.overflowY = '';
    this.container.style.overflowY = '';

    this.events.emit("modal:close");
  }
}

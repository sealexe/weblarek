import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter, IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    })
  }

  set counter(value: number) {
    this.setText(this.counterElement, value);
  }
}



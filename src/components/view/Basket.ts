import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IBasket {
  basketList: HTMLElement[];
  basketEmptyElement: HTMLElement;
  total: number;
  state: boolean;
}

export class Basket extends Component<IBasket> {
  protected basketContainer: HTMLElement;
  protected totalPrice: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this.basketContainer = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );
    this.totalPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );

    this.basketButton.addEventListener("click", () =>
      this.events.emit("order:open")
    );
  }

   set basketList(items: HTMLElement[]) {
    this.basketContainer.replaceChildren(...items);

  }

  set total(value: number) {
    this.setText(this.totalPrice, `${value} синапсов`);
  }

  set state(value: boolean) {
    if (value) {
      const emptyElement = document.createElement("p");
      emptyElement.style.color = "rgba(255, 255, 255, 0.3)";
      emptyElement.textContent = "Корзина пуста";
      this.basketContainer.append(emptyElement);
      this.basketButton.disabled = value;
    } else {
      this.basketButton.disabled = value;
    }
  }
}

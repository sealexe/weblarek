import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { BaseForm, IBaseForm } from "./BaseForm";

interface IOrderForm extends IBaseForm {
  address: string;
}

export class OrderForm extends BaseForm<IOrderForm> {
  protected cashButton: HTMLButtonElement;
  protected cardButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(protected container: HTMLFormElement, events: EventEmitter) {
    super(container, events)

    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}

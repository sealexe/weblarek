import { PaymentMethod } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export interface IBaseForm {
  valid: boolean;
  errors: string[];
}

export class BaseForm<T extends IBaseForm> extends Component<T> {
  protected submit: HTMLButtonElement;
  protected errorsForm: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
    super(container);

    this.submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this.errorsForm = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.container.addEventListener('submit', (e) => {
        e.preventDefault();
        // this.events.emit(`${this.container.name}:submit`);
        this.events.emit('form:submit');
    });

  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
        field,
        value
    });
  }

  set valid(value: boolean) {
    this.submit.disabled = !value;
  }
}

interface IOrderForm extends IBaseForm {
  address: string;
  payment: string;

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

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { payment: PaymentMethod.Cash });
    });

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { payment: PaymentMethod.Card });
    });
  }

  set payment(value: string) {

    this.toggleClass(this.cashButton, 'button_alt-active', false);
    this.toggleClass(this.cardButton, 'button_alt-active', false);

    this.toggleClass(this.cashButton, 'button_alt-active', value === PaymentMethod.Cash);
    this.toggleClass(this.cardButton, 'button_alt-active', value === PaymentMethod.Card);

  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set errors(value: string[]) {
    this.setText(this.errorsForm, value.join(' '));
  }

}

interface IContactsForm extends IBaseForm {
  email: string;
  phone: string;
}

export class ContactsForm extends BaseForm<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected payButton: HTMLButtonElement;

  constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.payButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

    
  }
}

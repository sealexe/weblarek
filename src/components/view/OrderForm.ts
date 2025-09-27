import { IBuyerValidation, PaymentMethod } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { BaseForm, IBaseForm } from "./BaseForm";

interface IOrderForm extends IBaseForm {
  address: string;
  payment: PaymentMethod;
  errors: IBuyerValidation;
}

export class OrderForm extends BaseForm<IOrderForm> {
  protected cashButton: HTMLButtonElement;
  protected cardButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected orderButton: HTMLButtonElement;

  constructor(protected container: HTMLFormElement, events: EventEmitter) {
    super(container, events)

    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.order__button', this.container);

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order:payment:change', { payment: PaymentMethod.Cash });
    });

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order:payment:change', { payment: PaymentMethod.Card });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:address:change', { address: this.addressInput.value });
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('form:submit', { formName: 'order' });
    })
  }

  set payment(value: PaymentMethod) {
    this.cashButton.classList.remove('button_alt-active');
    this.cardButton.classList.remove('button_alt-active');

    if (value === PaymentMethod.Cash) {
      this.cashButton.classList.add('button_alt-active');
    } else if (value === PaymentMethod.Card) {
      this.cardButton.classList.add('button_alt-active');
    }
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set errors(value: IBuyerValidation) {
    this.errorsForm.innerHTML = '';
    const errorMessages: string[] = [];

    if (value.address) errorMessages.push(value.address);
    if (value.payment) errorMessages.push(value.payment);

    if (errorMessages.length > 0) {
      errorMessages.forEach(message => {
        const errorItem = document.createElement('p');
        errorItem.textContent = message;
        this.errorsForm.appendChild(errorItem);
      });
    }
  }
}

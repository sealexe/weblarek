import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { BaseForm, IBaseForm } from "./BaseForm";

interface IContactsForm extends IBaseForm {
  email: string;
  phone: string;
}

export class ContactsForm extends BaseForm<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone', this.container);

  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}

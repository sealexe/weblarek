import { IBuyerValidation } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export interface IBaseForm {
  errors: IBuyerValidation;
  valid: boolean;
}

export class BaseForm<T extends IBaseForm> extends Component<T> {
  protected submit: HTMLButtonElement;
  protected errorsForm: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
    super(container);

    this.submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this.errorsForm = ensureElement<HTMLElement>('.form__errors', this.container);

    this.submit.addEventListener('click', () => this.events.emit('form:submit'));

  }

  set errors(value: string) {
    this.errorsForm.replaceChildren(value);
  }

}

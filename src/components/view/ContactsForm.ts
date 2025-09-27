// import { IBuyerValidation } from "../../types";
// import { ensureElement } from "../../utils/utils";
// import { EventEmitter } from "../base/Events";
// import { BaseForm, IBaseForm } from "./BaseForm";

// interface IContactsForm extends IBaseForm {
//   email: string;
//   phone: string;
//   errors: IBuyerValidation;
// }

// export class ContactsForm extends BaseForm<IContactsForm> {
//   protected emailInput: HTMLInputElement;
//   protected phoneInput: HTMLInputElement;
//   protected payButton: HTMLButtonElement;

//   constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
//     super(container, events);

//     this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
//     this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
//     this.payButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

//     // Обработчики для полей контактов
//     this.emailInput.addEventListener('input', () => {
//       this.events.emit('contacts:email:change', { email: this.emailInput.value });
//     });

//     this.phoneInput.addEventListener('input', () => {
//       this.events.emit('contacts:phone:change', { phone: this.phoneInput.value });
//     });

//     // Обработчик отправки формы контактов
//     this.container.addEventListener('submit', (e) => {
//       e.preventDefault();
//       this.events.emit('form:submit', { formName: 'contacts' });
//     });

//     this.payButton.addEventListener('submit', () => {
//       this.events.emit('order:pay');
//     })

//   }

//   set errors(value: IBuyerValidation) {
//     this.errorsForm.innerHTML = '';
//     const errorMessages: string[] = [];

//     if (value.email) errorMessages.push(value.email);
//     if (value.phone) errorMessages.push(value.phone);

//     if (errorMessages.length > 0) {

//       errorMessages.forEach(message => {
//         const errorItem = document.createElement('p');
//         errorItem.textContent = message;
//         this.errorsForm.append(errorItem);
//       });
//     }
//   }

//   set email(value: string) {
//     this.emailInput.value = value;
//   }

//   set phone(value: string) {
//     this.phoneInput.value = value;
//   }
// }

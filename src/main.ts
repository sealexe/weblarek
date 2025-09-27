import { Api } from "./components/base/Api";
import { Cart } from "./components/models/Cart";
import { Catalog } from "./components/models/Catalog";
import { Buyer } from "./components/models/Buyer";
import { ProductsAPI } from "./components/models/ProductsApi";
import "./scss/styles.scss";
import { IBuyer, IBuyerValidation, IProduct, PaymentMethod } from "./types";
import { API_URL } from "./utils/constants";
import { Header } from "./components/view/Header";
import { EventEmitter } from "./components/base/Events";
import { ModalWindow } from "./components/view/ModalWindow";
import { cloneTemplate } from "./utils/utils";
import { Gallery } from "./components/view/Gallery";
import { CatalogCard } from "./components/view/CatalogCard";
import { PreviewCard } from "./components/view/PreviewCard";
import { Basket } from "./components/view/Basket";
import { BasketCard } from "./components/view/BasketCard";
import { OrderSuccess } from "./components/view/OrderSuccess";
import { ContactsForm, OrderForm } from "./components/view/Form";

const events = new EventEmitter();
const productsModel = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const api = new Api(API_URL);
const productsApi = new ProductsAPI(api);

//Элементы разметки

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const modal = document.querySelector('.modal') as HTMLElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

//Модели

const gallery = new Gallery(document.querySelector('.page__wrapper') as HTMLElement);
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const modalWindow = new ModalWindow(document.querySelector('.modal') as HTMLElement, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new OrderSuccess(cloneTemplate(successTemplate), events);

// const basketCard = new BasketCard(cloneTemplate(basketCardTemplate));

productsApi
  .getProducts()
  .then((data) => {
    productsModel.setProducts(data.items);
    console.log('вывод из запроса ', productsModel.getProducts());
  })
  .catch((err) => console.log(err));

events.on('catalog:changed', () => {
  const itemCards = productsModel.getProducts().map((item) => {
    const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit('card:select', item)
      }
    });
    return card.render(item);
  })
  gallery.render({ catalog: itemCards });
});

events.on('card:select', (item: IProduct) => {
  productsModel.setProductCard(item.id);
  const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
    addClick: () => {
      const productExist = cart.isProductExist(item.id);
      if(productExist) {
        events.emit('product:delete', item);
        card.render({ buttonText: 'В корзину' });
      }
      if (!productExist) {
        events.emit('product:add')
        card.render({ buttonText: 'Удалить из корзины' })
      }
    }
  });
  const productExist = cart.isProductExist(item.id);
  if (item.price === null) {
    card.render(({ attribute: 'disabled', buttonText: 'Недоступно' }));
  } else if (productExist) {
    card.render({ ...item, buttonText: 'Удалить из корзины' })
  } else {
    card.render({ ...item, buttonText: 'В корзину' })
  }
  const cardElement = card.render(item);
  modalWindow.render({ content: cardElement });
  events.emit('modal:visible');
});

events.on('modal:visible', () => {
  modal.classList.toggle('modal_active');
});

events.on('basket:open', () => {
  const basketElement = basket.render();
  modalWindow.render({ content: basketElement });
  modal.classList.toggle('modal_active');
  events.emit('cart:changed');
})

events.on('cart:changed', () => {
  const totalSum = cart.getTotalSum();
  const total = cart.getTotal();
  const basketCards = cart.getProducts().map((item, idx) => {
    const basketCard = new BasketCard(cloneTemplate(basketCardTemplate), {
      delClick: () => events.emit('product:delete', item)
    });
    basketCard.render({ index: idx + 1 });
    return basketCard.render(item);
  });
  if (cart.getProducts().length === 0) {
    const emptyElement = document.createElement('p');
    emptyElement.style.color = 'rgba(255, 255, 255, 0.3)'
    emptyElement.textContent = 'Корзина пуста';
    basket.render({ basketEmptyElement: emptyElement, disabled: 'disabled'})
    header.render({ counter: total })
  } else {
    basket.render({ basketList: basketCards, total: totalSum, abled: 'disabled'});
    header.render({counter: total});
  }

});

events.on('product:delete', (item: IProduct) => {
  cart.deleteProduct(item.id);
});

events.on('product:add', () => {
  cart.addProduct(productsModel.getProduct());
})

events.on('order:open', () => {
  const orderForm = order.render();
  modalWindow.render({ content: orderForm });
});

events.on('contacts:submit', () => {
  const total = cart.getTotalSum();
  const items =  cart.getProducts().map(product => product.id);
  const buyerData = buyer.getData();
  const order = { total, items, ...buyerData };
  // Отправляем заказ
  console.log('Заказ отправлен:', order);
  // Здесь можно добавить отправку на сервер
  productsApi
    .postOrder(order)
    .then(data => console.log(data))
    .catch((err) => console.log(err));
  const successElement = success.render({ amount: total });
  modalWindow.render({ content: successElement });
})

// events.on('formErrors:change', (errors: Partial<IBuyerValidation>) => {
//     const { address, payment } = errors;
//     const errorsElement = [address, payment].filter(value => value !== undefined);
//     console.log('состояние валидации', !address && !payment)
//     order.render({ errors: errorsElement, valid: !address && !payment })
//     console.log(buyer.getData())

// });

events.on('formErrors:change', (errors: Partial<IBuyerValidation>) => {
    const { address, payment, email, phone } = errors;

    const orderErrors = [address, payment].filter(value => value !== undefined);
    const contactsErrors = [email, phone].filter(value => value !== undefined);

    order.render({ errors: orderErrors, valid: !address && !payment });
    contacts.render({ errors: contactsErrors, valid: !email && !phone });

    console.log('Данные покупателя', buyer.getData())
});

events.on(/^order\..*:change/, (data: { field: keyof IBuyer, value: string}) => {
    buyer.saveData({ [data.field]: data.value });
});

events.on(/^contacts\..*:change/, (data: { field: keyof IBuyer, value: string}) => {
    buyer.saveData({ [data.field]: data.value });
});

events.on('order.payment:change', (data: { payment: PaymentMethod }) => {
  buyer.saveData({payment: data.payment})
  order.render({ payment: data.payment })
})

events.on('order:submit', () => {
  const contactsElement = contacts.render();
  modalWindow.render({content: contactsElement})
})

events.on('order:end', () => {
  cart.clearCart();
  events.emit('modal:visible');
})


//  buyer.saveData({payment: data.payment});

// saveData(patch: Partial<IBuyer>): void {
//     this.buyerData = { ...this.buyerData, ...patch };
//   }

// function validateOrderFields(): IBuyerValidation {
//   const buyerData = buyer.getData();
//   const validationData: IBuyerValidation = {} as IBuyerValidation;

//   if (!buyerData.payment || buyerData.payment === ("" as PaymentMethod)) {
//     validationData.payment = "Выберите способ оплаты";
//   }

//   if (!buyerData.address) {
//     validationData.address = "Введите корректный адрес";
//   }

//   return validationData;
// }

// function isOrderFieldsValid(): boolean {
//   const errors = validateOrderFields();
//   return Object.keys(errors).length === 0;
// }

// function updateForm(formName: string, validation: IBuyerValidation, isValid: boolean) {
//   const formData = {
//     ...buyer.getData(),
//     errors: validation,
//     valid: isValid,
//     buttonState: isValid
//   };

//   if (formName === 'order') {
//     const orderForm = order.render(formData);
//     modalWindow.render({ content: orderForm });
//   } else if (formName === 'contacts') {
//     const contactsForm = contacts.render(formData);
//     modalWindow.render({ content: contactsForm });
//   }
// }

// // Общий обработчик для всех форм
// events.on('form:submit', (data: { formName: string }) => {
//   const validation = buyer.validateData();
//   const isValid = buyer.isValid();

//   if (data.formName === 'order') {
//     const orderValidation = validateOrderFields();
//     const isOrderValid = isOrderFieldsValid();

//     if (isOrderValid) {
//       // Переходим к форме контактов
//       const contactsForm = contacts.render({
//         ...buyer.getData(),
//         errors: {} as IBuyerValidation,
//         valid: true,
//         buttonState: false
//       });
//       modalWindow.render({ content: contactsForm });
//     } else {
//       updateForm('order', orderValidation, isOrderValid);
//     }
//   } else if (data.formName === 'contacts') {
//     if (isValid) {
//       const total = cart.getTotalSum();
//       const items =  cart.getProducts().map(product => product.id);
//       const buyerData = buyer.getData();
//       const order = { total, items, ...buyerData };
//       // Отправляем заказ
//       console.log('Заказ отправлен:', order);
//       // Здесь можно добавить отправку на сервер
//       productsApi.postOrder(order)
//         .then(data => console.log(data));

//       const successElement = success.render({amount: total });
//       modalWindow.render({ content: successElement });

//     } else {
//       updateForm('contacts', validation, isValid);
//     }
//   }
// })

// events.on('order:payment:change', (data: { payment: PaymentMethod }) => {
//   buyer.saveData({payment: data.payment});
//   const validation = validateOrderFields();
//   const isValid = isOrderFieldsValid();
//   updateForm('order', validation, isValid);
// })

// events.on('order:address:change', (data: { address: string }) => {
//   buyer.saveData({ address: data.address });
//   const validation = validateOrderFields();
//   const isValid = isOrderFieldsValid();
//   updateForm('order', validation, isValid);
// });

// // Обработчики для формы контактов
// events.on('contacts:email:change', (data: { email: string }) => {
//   buyer.saveData({ email: data.email });
//   const validation = buyer.validateData();
//   const isValid = buyer.isValid();
//   updateForm('contacts', validation, isValid);
// });

// events.on('contacts:phone:change', (data: { phone: string }) => {
//   buyer.saveData({ phone: data.phone });
//   const validation = buyer.validateData();
//   const isValid = buyer.isValid();
//   updateForm('contacts', validation, isValid);
// });





// ВСЕ СОБЫТИЯ В КОНСОЛЬ

events.onAll(({ eventName, data }) => {
    console.log(eventName, data); // все события в консоль
})







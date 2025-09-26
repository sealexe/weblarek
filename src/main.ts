import { Api } from "./components/base/Api";
import { Cart } from "./components/models/Cart";
import { Catalog } from "./components/models/Catalog";
import { Buyer } from "./components/models/Buyer";
import { ProductsAPI } from "./components/models/ProductsApi";
import "./scss/styles.scss";
import { IProduct, PaymentMethod } from "./types";
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

const events = new EventEmitter();
const productsModel = new Catalog(events);
const cart = new Cart(events);

const api = new Api(API_URL);
const productsApi = new ProductsAPI(api);

//Элементы разметки

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const modal = document.querySelector('.modal') as HTMLElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

//Модели

const gallery = new Gallery(document.querySelector('.page__wrapper') as HTMLElement);
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const modalWindow = new ModalWindow(document.querySelector('.modal') as HTMLElement, events);
const basket = new Basket(cloneTemplate(basketTemplate));
const previewCard = new PreviewCard(cloneTemplate(cardPreviewTemplate));
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



// events.on('card:select', (item: IProduct) => {
//   productsModel.setProductCard(item.id);
//   const productExist = cart.isProductExist(item.id);
//   const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
//     addClick: () => {
//       console.log('po')
//       events.emit('product:add', item)
//     }
//   });
//   if (productExist) {
//     card.render({ buttonText: 'Удалить из корзины' })
//   }
//   if (item.price === null) {
//     card.render({ attribute: 'disabled' })
//   }
//   const cardElement = card.render(item);
//   modalWindow.render({ content: cardElement });
//   modal.classList.toggle('modal_active');
// });

// events.on('card:select', (item: IProduct) => {
//   productsModel.setProductCard(item.id);
//   const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
//     addClick: () => {
//       events.emit('product:add', item)
//       const productExist = cart.isProductExist(item.id);
//       console.log(productExist)
//       if (productExist) {
//         console.log('hey')
//         card.render({ buttonText: 'Удалить из корзины' })
//       }
//       if (!productExist) {
//         card.render({ buttonText: 'В корзину' })
//       }
//       if (item.price === null) {
//         card.render({ attribute: 'disabled' })
//       }
//     }
//   });
//     const cardElement = card.render(item);
//     modalWindow.render({ content: cardElement });
//     modal.classList.toggle('modal_active');
// });

events.on('card:select', (item: IProduct) => {
  productsModel.setProductCard(item.id);
  const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
    addClick: () => {
      const productExist = cart.isProductExist(item.id);
      if(productExist) {
        events.emit('product:delete', item)
        console.log('test_delete')
        card.render({ buttonText: 'В корзину' })
      }
      if (!productExist) {
        events.emit('product:add')
        console.log('test_add')
        card.render({ buttonText: 'Удалить из корзины' })
      }
    }
  });
    const cardElement = card.render(item);
    modalWindow.render({ content: cardElement });
    modal.classList.toggle('modal_active');
});

events.on('modal:visible', () => {
  modal.classList.toggle('modal_active');
});

events.on('basket:open', () => {
  const basketElement = basket.render();
  modalWindow.render({ content: basketElement });
  modal.classList.toggle('modal_active');
})

events.on('cart:changed', () => {
  const basketCards = cart.getProducts().map((item, idx) => {
    const basketCard = new BasketCard(cloneTemplate(basketCardTemplate), {
      delClick: () => events.emit('product:delete', item)
    });
    basketCard.render({ index: idx + 1 });
    return basketCard.render(item);
  });
  const totalSum = cart.getTotalSum();
  const total = cart.getTotal();
  basket.render({ basketList: basketCards, total: totalSum});
  header.render({counter: total});
  if (cart.getProducts().length === 0) {
    const emptyElement = document.createElement('p');
    emptyElement.textContent = 'Корзина пуста';
    basket.render({ basketEmptyElement: emptyElement })
  }
});

events.on('product:delete', (item: IProduct) => {
  cart.deleteProduct(item.id);
});

events.on('product:add', () => {
  cart.addProduct(productsModel.getProduct());
})




// events.on('product:add', (item: IProduct) => {
//   cart.addProduct(productsModel.getProduct());
//   const productExist = cart.isProductExist(item.id);
//   if (productExist) {
//     const previewCard = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
//       delClick: () => events.emit('product:delete', item),
//     });
//     previewCard.render({ buttonText: "Удалить из корзины" });
//     const card = previewCard.render(item);
//     modalWindow.render({ content: card });
//   }
// });


// events.on('product:delete', (item: IProduct) => {
//   const productExist = cart.isProductExist(item.id);
//   if (!productExist) {
//     const previewCard = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
//       addClick: () => events.emit('product:add', item),
//     });
//     previewCard.render({ buttonText: "В корзину" });
//     const card = previewCard.render(item);
//     modalWindow.render({ content: card });
//   }
//   cart.deleteProduct(item.id);
// });


// events.on('basket:open', () => {
// //   // const basketCards = cart.getProducts().map((item) => {
// //   //   const basketCard = new BasketCard(cloneTemplate(basketCardTemplate), events);
// //   //   return basketCard.render(item);
// //   // })
// //   // const totalSum = cart.getTotalSum();
// //   // const basketListElement = basket.render({ basketList: basketCards, total: totalSum});
// //   // modalWindow.render({ content: basketListElement });
// //   modal.classList.toggle('modal_active');
// // })




// productsModel.setProducts(apiProducts.items);
// console.log("Массив товаров из каталога: ", productsModel.getProducts());

// productsModel.setProductCard("b06cde61-912f-4663-9751-09956c0eed67");
// console.log(
//   "Выбранная карточка товара из каталога: ",
//   productsModel.getProduct()
// );
// console.log(
//   "Получение товара из каталога по его id: ",
//   productsModel.getProductById("412bcf81-7e75-4e70-bdb9-d3c73c9803b7")
// );

//Проверка методов корзины
// const cartModel = new Cart();
// console.log("Пустая корзина с товарами: ", cartModel.getProducts());

// cartModel.addProduct(productsModel.getProduct());
// console.log("Корзина с добавленным товаром: ", cartModel.getProducts());

// productsModel.setProductCard("854cef69-976d-4c2a-a18c-2aa45046c390");
// cartModel.addProduct(productsModel.getProduct());

// console.log("Корзина с 2-мя добавленными товарами: ", cartModel.getProducts());
// console.log("Общее количество товаров в корзине: ", cartModel.getTotal());
// console.log(
//   "Общая стоимость всех товаров в корзине: ",
//   cartModel.getTotalSum()
// );
// console.log(
//   "Товар присутствует в корзине: ",
//   cartModel.isProductExist("b06cde61-912f-4663-9751-09956c0eed67")
// );
// console.log(
//   "Товара в корзине нет: ",
//   cartModel.isProductExist("412bcf81-7e75-4e70-bdb9-d3c73c9803b7")
// );

// cartModel.deleteProduct("b06cde61-912f-4663-9751-09956c0eed67");
// console.log("Товар из корзины удален: ", cartModel.getProducts());

// cartModel.clearCart();
// console.log("Корзина пуста: ", cartModel.getProducts());

//Проверка методов покупателя
// const buyerModel = new Buyer();
// const testBuyer_1 = {
//   payment: PaymentMethod.Cash,
//   address: "Бейкер Стрит 221Б",
//   email: "test@email.com",
//   phone: "555-135-12",
// };

// buyerModel.saveData(testBuyer_1);
// console.log("1-й покупатель: ", buyerModel.getData());
// console.log("Успешная валидация данных: ", buyerModel.validateData());
// buyerModel.clearData();
// console.log("Данные покупателя очищены: ", buyerModel.getData());

// const testBuyer_2 = {
//   payment: PaymentMethod.Null,
//   address: "",
//   email: "test@email.com",
//   phone: "",
// };

// buyerModel.saveData(testBuyer_2);
// console.log("Данные не прошли валидацию: ", buyerModel.validateData());

// Проверка подключения сервера

  // const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
  // const baseCard = new BaseCard(cloneTemplate(cardTemplate));
  // const card_1 = productsModel.getProductById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');

  // gallery.append(baseCard.render({
  //   title: card_1.title,
  //   price: card_1.price
  // }))

  //Тест header

  // const headerContainer = document.querySelector('.header') as HTMLElement;

  // const header = new Header(events, headerContainer);

  // const obj1 = {
  //   counter: 10
  // }

  // gallery.append(header.render(obj1));

  // const modalWindow = document.querySelector('.modal') as HTMLElement;

  // const modal = new ModalWindow(modalWindow);

  // gallery.append(modal.render());

  // const products = productsModel.getProducts();

import { Api } from "./components/base/Api";
import { Cart } from "./components/models/Cart";
import { Catalog } from "./components/models/Catalog";
import { Buyer } from "./components/models/Buyer";
import { ProductsAPI } from "./components/models/ProductsApi";
import "./scss/styles.scss";
import { IBuyer, IBuyerValidation, IProduct, PaymentMethod } from "./types";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { ModalWindow } from "./components/view/ModalWindow";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { CatalogCard } from "./components/view/CatalogCard";
import { PreviewCard } from "./components/view/PreviewCard";
import { Basket } from "./components/view/Basket";
import { BasketCard } from "./components/view/BasketCard";
import { OrderSuccess } from "./components/view/OrderSuccess";
import { ContactsForm, OrderForm } from "./components/view/Form";
import { Gallery } from "./components/view/Gallery";
import { Header } from "./components/view/Header";

const events = new EventEmitter();
const api = new Api(API_URL);
const productsApi = new ProductsAPI(api);

// Модель данных

const productsModel = new Catalog(events);

//Элементы разметки

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketCardTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const modalContainer = ensureElement<HTMLElement>(".modal");
const headerContainer = ensureElement<HTMLElement>(".header");
const galleryContaier = ensureElement<HTMLElement>(".page__wrapper");

// Экземпляры классов

const cart = new Cart(events);
const buyer = new Buyer(events);
const modalWindow = new ModalWindow(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new OrderSuccess(cloneTemplate(successTemplate), events);
const gallery = new Gallery(galleryContaier);
const header = new Header(headerContainer, events);

productsApi
  .getProducts()
  .then((data) => {
    productsModel.setProducts(data.items);
  })
  .catch((err) => console.log(err));

events.on("catalog:changed", () => {
  const itemCards = productsModel.getProducts().map((item) => {
    const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit("card:select", item);
      },
    });
    return card.render(item);
  });
  gallery.render({ catalog: itemCards });
});

events.on("card:select", (item: IProduct) => {
  productsModel.setProductCard(item.id);
});

events.on('preview:open', () => {
  const product = productsModel.getProduct();
  const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
    addClick: () => {
      const productExist = cart.isProductExist(product.id);
      if (productExist) {
        events.emit("product:delete", product);
        card.render({ buttonText: "В корзину" });
      }
      if (!productExist) {
        events.emit("product:add");
        card.render({ buttonText: "Удалить из корзины" });
      }
    },
  });
  const productExist = cart.isProductExist(product.id);
  if (product.price === null) {
    card.render({ attribute: "disabled", buttonText: "Недоступно" });
  } else if (productExist) {
    card.render({ ...product, buttonText: "Удалить из корзины" });
  } else {
    card.render({ ...product, buttonText: "В корзину" });
  }
  const cardElement = card.render(product);
  modalWindow.render({ content: cardElement });
  modalWindow.open();
})

events.on("basket:open", () => {
  const basketElement = basket.render();
  modalWindow.render({ content: basketElement });
  modalWindow.open();
});

events.on("cart:changed", () => {
  const cartProducts = cart.getProducts();
  const totalSum = cart.getTotalSum();
  const productstotal = cart.getTotal();
  const basketCards = cartProducts.map((item, idx) => {
    const basketCard = new BasketCard(cloneTemplate(basketCardTemplate), {
      delClick: () => events.emit("product:delete", item),
    });
    basketCard.render({ index: idx + 1 });
    return basketCard.render(item);
  });
  basket.render({
    basketList: basketCards,
    total: totalSum,
    state: !productstotal
  });
  header.render({ counter: productstotal });
});

events.on("product:delete", (item: IProduct) => {
  cart.deleteProduct(item.id);
});

events.on("product:add", () => {
  cart.addProduct(productsModel.getProduct());
});

events.on("order:open", () => {
  const orderForm = order.render();
  modalWindow.render({ content: orderForm });
});

events.on("formErrors:change", (errors: Partial<IBuyerValidation>) => {
  const { address, payment, email, phone } = errors;
  const orderErrors = [address, payment].filter((value) => value !== undefined);
  const contactsErrors = [email, phone].filter((value) => value !== undefined);

  order.render({ errors: orderErrors, valid: !address && !payment });
  contacts.render({ errors: contactsErrors, valid: !email && !phone });
});

events.on(
  /^order\..*:change/,
  (data: { field: keyof IBuyer; value: string }) => {
    buyer.saveData({ [data.field]: data.value });
  }
);

events.on(
  /^contacts\..*:change/,
  (data: { field: keyof IBuyer; value: string }) => {
    buyer.saveData({ [data.field]: data.value });
  }
);

events.on("order.payment:change", (data: { payment: PaymentMethod }) => {
  buyer.saveData({ payment: data.payment });
  order.render({ payment: data.payment });
});

events.on("order:submit", () => {
  const contactsElement = contacts.render();
  modalWindow.render({ content: contactsElement });
});

events.on("contacts:submit", () => {
  const total = cart.getTotalSum();
  const items = cart.getProducts().map((product) => product.id);
  const buyerData = buyer.getData();
  const order = { total, items, ...buyerData };

productsApi.postOrder(order)
  .then((data) => {
    const successElement = success.render({ amount: data.total });
    modalWindow.render({ content: successElement });
    cart.clearCart();
    buyer.clearData();
  })
  .catch((err) => console.log(err));
});

events.on("order:end", () => {
  modalWindow.close();
});

events.on('modal:open', () => {
    gallery.locked = true;
});

events.on('modal:close', () => {
    gallery.locked = false;
});



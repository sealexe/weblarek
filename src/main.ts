import { Api } from "./components/base/Api";
import { Cart } from "./components/models/Cart";
import { Catalog } from "./components/models/Catalog";
import { Buyer } from "./components/models/Buyer";
import { ProductsAPI } from "./components/models/ProductsApi";
import "./scss/styles.scss";
import { PaymentMethod } from "./types";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

// //Проверка методов каталога
const productsModel = new Catalog();

productsModel.setProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", productsModel.getProducts());

productsModel.setProductCard("b06cde61-912f-4663-9751-09956c0eed67");
console.log(
  "Выбранная карточка товара из каталога: ",
  productsModel.getProduct()
);
console.log(
  "Получение товара из каталога по его id: ",
  productsModel.getProductById("412bcf81-7e75-4e70-bdb9-d3c73c9803b7")
);

//Проверка методов корзины
const cartModel = new Cart();
console.log("Пустая корзина с товарами: ", cartModel.getProducts());

cartModel.addProduct(productsModel.getProduct());
console.log("Корзина с добавленным товаром: ", cartModel.getProducts());

productsModel.setProductCard("854cef69-976d-4c2a-a18c-2aa45046c390");
cartModel.addProduct(productsModel.getProduct());

console.log("Корзина с 2-мя добавленными товарами: ", cartModel.getProducts());
console.log("Общее количество товаров в корзине: ", cartModel.getTotal());
console.log(
  "Общая стоимость всех товаров в корзине: ",
  cartModel.getTotalSum()
);
console.log(
  "Товар присутствует в корзине: ",
  cartModel.getProductExist("b06cde61-912f-4663-9751-09956c0eed67")
);
console.log(
  "Товара в корзине нет: ",
  cartModel.getProductExist("412bcf81-7e75-4e70-bdb9-d3c73c9803b7")
);

cartModel.deleteProduct("b06cde61-912f-4663-9751-09956c0eed67");
console.log("Товар из корзины удален: ", cartModel.getProducts());

cartModel.clearCart();
console.log("Корзина пуста: ", cartModel.getProducts());

//Проверка методов покупателя
const buyerModel = new Buyer();
const testBuyer_1 = {
  payment: PaymentMethod.Cash,
  address: "Бейкер Стрит 221Б",
  email: "test@email.com",
  phone: "555-135-12",
};

buyerModel.saveData(testBuyer_1);
console.log("1-й покупатель: ", buyerModel.getData());
console.log("Успешная валидация данных: ", buyerModel.validateData());
buyerModel.clearData();
console.log("Данные покупателя очищены: ", buyerModel.getData());

const testBuyer_2 = {
  payment: PaymentMethod.Null,
  address: "",
  email: "test@email.com",
  phone: "",
};

buyerModel.saveData(testBuyer_2);
console.log("Данные не прошли валидацию: ", buyerModel.validateData());

// Проверка подключения сервера
const api = new Api(API_URL);
const productsApi = new ProductsAPI(api);

productsApi
  .getProducts()
  .then((data) => {
    productsModel.setProducts(data.items);
    console.log(productsModel.getProducts());
  })
  .catch((err) => console.log(err));

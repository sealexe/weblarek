import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Cart {
  protected products: IProduct[] = [];

  constructor(protected events: EventEmitter) {}

  addProduct(product: IProduct) {
    this.products.push(product);
    this.events.emit('cart:changed');
  }

  deleteProduct(id: string) {
    this.products = this.products.filter((product) => product.id != id);
    this.events.emit('cart:changed');
  }

  clearCart() {
    this.products = [];
    this.events.emit('cart:changed');
  }

  getTotal(): number {
    return this.products.length;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getTotalSum(): number {
    return this.products.reduce((sum, product) => {
      return product.price ? sum + product.price : sum;
    }, 0);
  }

  isProductExist(id: string): boolean {
    return this.products.some((product) => product.id === id);
  }
}

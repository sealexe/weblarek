import { IProduct } from "../../types";

export class Cart {
  protected products: IProduct[] = [];

  constructor() {}

  addProduct(product: IProduct) {
    this.products.push(product);
  }

  deleteProduct(id: string) {
    this.products = this.products.filter((product) => product.id != id);
  }

  clearCart() {
    this.products = [];
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

  getProductExist(id: string): boolean {
    return this.products.some((product) => product.id === id);
  }
}

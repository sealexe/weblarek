import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Catalog {
  protected products: IProduct[] = [];
  protected productCard: IProduct = {
    id: "",
    description: "",
    image: "",
    title: "",
    category: "",
    price: null,
  };

  constructor(protected events: EventEmitter) { }

  setProducts(products: IProduct[]) {
    this.products = products;
    this.events.emit('catalog:changed');
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    const selectedCard = this.products.find((card) => card.id === id);
    if (selectedCard) {
      return selectedCard;
    }
  }

  setProductCard(id: string) {
    const selectedCard = this.getProductById(id);
    if (selectedCard) {
      this.productCard = selectedCard;
    }
    this.events.emit('preview:open');
  }

  getProduct(): IProduct {
    return this.productCard;
  }
}

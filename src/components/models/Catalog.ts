import { IProduct } from "../../types";

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

  constructor() { }

  setProducts(products: IProduct[]) {
    this.products = products;
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
  }

  getProduct(): IProduct {
    return this.productCard;
  }
}

import { IApi, IPostOrder, IResponseProducts } from "../../types";

export class ProductsAPI {
  private readonly api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IResponseProducts> {
    return this.api.get<IResponseProducts>("/product/");
  }

  postOrder(data: IPostOrder): Promise<IPostOrder> {
    return this.api.post("/order/", data);
  }
}

export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
  delClick?: (event: MouseEvent) => void;
  addClick?: (event: MouseEvent) => void;
  testClick?: (event: MouseEvent) => void;
};

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export enum PaymentMethod {
  Card = "card",
  Cash = "cash",
  Null = "",
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
}


export interface IBuyerValidation {
  address: string;
  email: string;
  phone: string;
  payment: string;
}

export interface IResponseProducts extends IProduct {
  total: number;
  items: IProduct[];
}

export interface IPostOrder extends IBuyer {
  total: number;
  items: string[];
}


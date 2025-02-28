export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "salon-owner" | "admin";
}

export interface ISalon {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  minimum_service_price: number;
  maximum_service_price: number;
  offer_status: "active" | "inactive";
  owner: IUser;
  created_at: string;
}

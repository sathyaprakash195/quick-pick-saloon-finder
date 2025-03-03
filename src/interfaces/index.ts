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
  latitude: string
  longitude: string
  owner: IUser;
  created_at: string;
  updated_at: string;
}

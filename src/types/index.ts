export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  type: string;
  image: string;
}

export interface Comment {
  id: number;
  propertyId: number;
  user: string;
  text: string;
  createdAt: string;
}

export interface Like {
  id: number;
  propertyId: number;
  userId: number;
}

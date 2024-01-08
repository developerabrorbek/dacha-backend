export class UpdateUserRequest {
  id: string;
  name?: string;
  image?: any;
  roles?: string[];
  phone?: string;
  favoriteCottages?: string[];
  password?: string;
  username?: string;
  email?: string;
}
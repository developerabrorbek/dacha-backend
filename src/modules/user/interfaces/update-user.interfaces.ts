export class UpdateUserRequest {
  id: string;
  name?: string;
  image?: string;
  roles?: string[];
  phone?: string;
  favoriteCottages?: string[];
  password?: string;
  username?: string;
  email?: string;
}
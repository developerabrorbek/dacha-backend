export class UpdateUserRequest {
  id: string;
  name?: string;
  image?: any;
  roles?: string[];
  phone?: string;
  password?: string;
  username?: string;
}
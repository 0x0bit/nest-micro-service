import { User } from '../../../../../proto/generated/user.interface';

export class CreateUserDto implements User {
  id: number = 0;
  username: string;
  password: string;
  age: number;
  name: string;
}

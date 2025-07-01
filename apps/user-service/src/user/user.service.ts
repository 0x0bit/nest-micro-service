import { Injectable } from '@nestjs/common';
import { UpdateUserPayload, User } from 'proto/generated/user.interface';

const users: User[] = [
  { id: 1, username: 'zs1', password: '123456', name: 'zs1', age: 11 },
  { id: 2, username: 'zs2', password: '123456', name: 'zs2', age: 12 },
  { id: 3, username: 'zs3', password: '123456', name: 'zs3', age: 13 },
  { id: 4, username: 'zs4', password: '123456', name: 'zs4', age: 14 },
  { id: 5, username: 'zs5', password: '123456', name: 'zs5', age: 15 },
];

@Injectable()
export class UserService {
  create(createUserDto: User) {
    users.push(createUserDto);
    return createUserDto;
  }

  findAll() {
    return users;
  }

  findOne(id: number) {
    return users.find((v) => v.id === id);
  }

  update(id: number, updateUserDto: UpdateUserPayload) {
    console.log(id, updateUserDto);
    let user = users.find((v) => v.id === id);
    if (user) {
      user = Object.assign(user, updateUserDto);
    }
    return user;
  }

  remove(id: number) {
    return users.find((v) => v.id === id);
  }
}

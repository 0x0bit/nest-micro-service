import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import {
  GetUserByIdRequest,
  RemoveUserByIdRequest,
  UpdateUserRequest,
  User,
} from '../../../../proto/generated/user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService')
  Create(@Payload() createUserDto: User) {
    const user = this.userService.create(createUserDto);
    return { user };
  }

  @GrpcMethod('UserService', 'FindAll')
  FindAll() {
    const users = this.userService.findAll();
    return { users };
  }

  @GrpcMethod('UserService')
  FindOne(@Payload() payLoad: GetUserByIdRequest) {
    const { id } = payLoad;
    const user = this.userService.findOne(id);
    return { user };
  }

  @GrpcMethod('UserService')
  Update(@Payload() updateUserDto: UpdateUserRequest) {
    const user = this.userService.update(
      updateUserDto.id,
      updateUserDto.payload!,
    );
    return { user };
  }

  @GrpcMethod('UserService')
  Remove(@Payload() payLoad: RemoveUserByIdRequest) {
    const user = this.userService.remove(payLoad.id);
    return { user };
  }
}

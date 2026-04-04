import { UserResponseDto } from 'src/users/dto';
import { User } from 'src/users/entities/user.entity';
import { LoginResponseDto, RegisterResponseDto } from '../dto';

export class AuthResponse {
    static getUser(authenticatedUser: User): UserResponseDto {
        const { password, company, bookings, ...userResponse } = authenticatedUser;
        return userResponse;
    }
      
    static getRegister(authenticatedUser: User, token: string): RegisterResponseDto {
        const userResponse = this.getUser(authenticatedUser);
        return { user: userResponse, token };
    }
      
    static getLogin(authenticatedUser: User, token: string): LoginResponseDto {
        const { userName } = authenticatedUser;
        return { userName, token };
    }
}
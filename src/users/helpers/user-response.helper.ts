import { PaginationUserResponseDto, UserResponseDto } from '../dto';
import { User } from '../entities/user.entity';

export class UserResponse {
    static get(user: User): UserResponseDto {
        const { password, company, bookings, isActive, ...userResponse } = user;
        return userResponse;
    }

    static getPagination(total: number, users: User[]): PaginationUserResponseDto {
        const usersResponse = users.map(user => this.get(user));
        return { total, users: usersResponse };
    }
}
import { User } from '../../users/entities/user.entity';
import { DataUserResponseDto, PaginationSpecialistResponseDto, SpecialistResponseDto } from '../dto';
import { Specialist } from '../entities/specialist.entity';

export class SpecialistResponse {
    static getDataUser(authenticatedUser: User): DataUserResponseDto {
        const { id, fullName, image } = authenticatedUser;
        return { id, fullName, image };
    }

    static get(specialist: Specialist): SpecialistResponseDto {
        const { id, user } = specialist;
        const dataUser = this.getDataUser(user);
        return { id, user: dataUser };
    }

    static getPagination(total: number, specialists: Specialist[]): PaginationSpecialistResponseDto {
        const specialistsResponse = specialists.map(specialist => this.get(specialist));
        return { total, specialists: specialistsResponse };
    }
}
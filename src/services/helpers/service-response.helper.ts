import { PaginationServiceResponseDto, ServiceResponseDto } from '../dto';
import { Service } from '../entities/service.entity';

export class ServiceResponse {
    static get(service: Service): ServiceResponseDto {
        const { isActive, branch, ...restService } = service;
        return restService;
    }

    static getPagination(total: number, services: Service[]): PaginationServiceResponseDto {
    const servicesResponse = services.map(service => this.get(service));
    return { total, services: servicesResponse };
    }
}
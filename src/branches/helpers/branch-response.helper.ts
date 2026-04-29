import { BranchResponseDto, PaginationBranchResponseDto } from '../dto';
import { Branch } from '../entities/branch.entity';

export class BranchResponse {
    static get(branch: Branch): BranchResponseDto {
        const { company, specialists, services, bookings, assessments, country, isActive, ...restBranch } = branch;
        return { ...restBranch, country: country.alpha2Code };
    }
    
    static getPagination(total: number, branches: Branch[]): PaginationBranchResponseDto {
        const branchesResponse = branches.map(branch => this.get(branch));
        return { total, branches: branchesResponse };
    }
}
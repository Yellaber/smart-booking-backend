import { BranchResponseDto, PaginationBranchResponseDto } from '../dto';
import { Branch } from '../entities/branch.entity';

export class BranchResponse {
    static get(branch: Branch): BranchResponseDto {
        const { company, specialists, services, bookings, isActive, ...restBranch } = branch;
        return restBranch;
    }
    
    static getPagination(total: number, branches: Branch[]): PaginationBranchResponseDto {
        const branchesResponse = branches.map(branch => this.get(branch));
        return { total, branches: branchesResponse };
    }
}
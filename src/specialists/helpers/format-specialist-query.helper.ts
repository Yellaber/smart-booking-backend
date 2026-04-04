import { Branch } from 'src/branches/entities/branch.entity';
import { UserRole } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { SpecialistQuery } from '../interfaces/specialist-query.interface';

export class FormatSpecialistQuery {
    static get(branch: Branch, authenticatedUser: User, specialistId?: string) {
        const { id } = branch;
        let query: SpecialistQuery = { branch: { id } };
        
        if(specialistId)
          query = { id: specialistId, ...query };
    
        return (authenticatedUser.roles.includes(UserRole.ADMIN) || authenticatedUser.roles.includes(UserRole.SUPER_USER))? 
          query: { ...query, isActive: true };
    }
}
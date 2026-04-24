import { Branch } from '../../branches/entities/branch.entity';
import { UserRole } from '../../common/enums';
import { User } from '../../users/entities/user.entity';
import { ServiceQuery } from '../interfaces/service-query.interface';

export class FormatServiceQuery {
  static get(branch: Branch, authenticatedUser: User, serviceId?: string) {
    const { id } = branch;
    let query: ServiceQuery = { branch: { id } };
          
    if(serviceId)
      query = { id: serviceId, ...query };
      
    return (authenticatedUser.roles.includes(UserRole.ADMIN) || authenticatedUser.roles.includes(UserRole.SUPER_USER))? 
      query: { ...query, isActive: true };
  }
}
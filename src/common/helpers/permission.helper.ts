import { ForbiddenException } from '@nestjs/common';
import { Company } from 'src/companies/entities/company.entity';
import { Specialist } from 'src/specialists/entities/specialist.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from '../enums';

const messageForbidden = 'User does not have permission to access this resource.';
const messageCompany = 'User must belong to the same company';

export class Permission {
  static validate(company: Company, authenticatedUser: User, userId: string, allowedRoles: UserRole[]) {
    if(authenticatedUser.roles.includes(UserRole.SUPER_USER)) return;

    const { company: companyAuthenticatedUser } = authenticatedUser;
    const isDifferentCompany = company.id !== companyAuthenticatedUser.id;
    const isDifferentUser = !allowedRoles.some(role => authenticatedUser.roles.includes(role)) && authenticatedUser.id !== userId;

    if(isDifferentCompany)
      throw new ForbiddenException(`${messageForbidden} ${messageCompany}`);

    if(isDifferentUser)
      throw new ForbiddenException(`${messageForbidden} User must be the same authenticated user`);
  }

  static validateInCompany(company: Company, authenticatedUser: User) {
    if(authenticatedUser.roles.includes(UserRole.SUPER_USER)) return;
    
    const { company: companyAuthenticatedUser } = authenticatedUser;
    const isDifferentCompany = company.id !== companyAuthenticatedUser.id;
    
    if(isDifferentCompany)
      throw new ForbiddenException(`${messageForbidden} ${messageCompany}`);
  }

  static validateSpecialist(company: Company, authenticatedUser: User, specialist: Specialist) {
    if(authenticatedUser.roles.includes(UserRole.SUPER_USER)) return;
  
    const { company: companyAuthenticatedUser } = authenticatedUser;
    const { user: specialistUser } = specialist;
    const isDifferentCompany = company.id !== companyAuthenticatedUser.id;
    const isDifferentUser = authenticatedUser.roles.includes(UserRole.SPECIALIST) && authenticatedUser.id !== specialistUser.id;
  
    if(isDifferentCompany)
      throw new ForbiddenException(`${messageForbidden} ${messageCompany}`);
  
    if(isDifferentUser)
      throw new ForbiddenException(`${messageForbidden} User must be the same specialist`);
  }
}
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../common/enums';

export const META_ROLES = 'roles';

export const RoleProtected = (...roles: UserRole[]) => SetMetadata(META_ROLES, roles);

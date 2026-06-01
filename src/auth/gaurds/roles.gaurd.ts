import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {Role} from '@prisma/client'
import {ROLES_KEY} from '../decorator/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector:Reflector){}
    async canActivate(context: ExecutionContext):Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if(!requiredRoles){
            return true;
        }
        const {user}=context.switchToHttp().getRequest();
        if(!user || !user.role){
           throw new ForbiddenException('User is not authorized');
        }
        const hasPermission = requiredRoles.some((role) => user.role === role);
        if(!hasPermission){
            throw new ForbiddenException('User is not authorized');
        }
        return true;
    }
}
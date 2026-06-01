import {Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(private jwtService:JwtService,
    private config:ConfigService,
   ){}
   async canActivate(context: ExecutionContext):Promise<boolean> {
       const request = context.switchToHttp().getRequest();
       const authHeader=request.headers.authorization;
       if(!authHeader || !authHeader.startsWith('Bearer ')){
       throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
       }
       const token=authHeader.split(' ')[1];    
       try{
        const payload=await this.jwtService.verifyAsync(token,{
            secret:this.config.get('JWT_ACCESS_TOKEN_SECRET'),
        });
        request['user']=payload;
        return true;
       }catch(err){
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
       }
   }
}

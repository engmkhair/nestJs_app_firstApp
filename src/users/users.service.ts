import { Body, ConflictException, Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
    constructor(private prisma:PrismaService){}
    
   async createOwner(dto:CreateUserDto){
    const existingUser=await this.prisma.user.findUnique({
        where:{
            email:dto.email
        }
    })
    if(existingUser){
        throw new ConflictException('email already exists');
    }
        const hashedPassword=await bcrypt.hash(dto.password,10);
        return this.prisma.user.create({
            data:{
                name:dto.name,
                email:dto.email,
                password:hashedPassword,
                role:'Owner'
            }
        })
   }
   async getAllOwners(){
    return this.prisma.user.findMany({
        where:{
            role:'Owner'
        }
    })
   }
   async getOwnerById(id:number){
    const owner=await this.prisma.user.findFirst({
        where:{
            id,
            role:'Owner'
        }
    })
    if(!owner){
        throw new ConflictException('owner not found');
    }
    return owner;
   }
   async updateOwner(@Param('id', ParseIntPipe) id: number,@Body() dto:UpdateUserDto){

       return this.prisma.user.update({
        where:{
            id
        },
        data:{
            name:dto.name,
            email:dto.email,
            password:dto.password?await bcrypt.hash(dto.password,10):undefined,
        }
    })
   }
   async deleteOwner(@Param('id', ParseIntPipe) id: number){
    return this.prisma.user.delete({
        where:{
            id
        }
    })
   }
}

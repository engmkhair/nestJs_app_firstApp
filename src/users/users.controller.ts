import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from "src/auth/decorator/roles.decorator";

@Controller('api/owners')
export class UsersController {
    constructor(private usersService:UsersService){}
    @Post('/create')
    @Roles('Admin')
    async createOwner(@Body() dto:any){
        return this.usersService.createOwner(dto);
    }
    @Get('/getAllOwners')
    @Roles('Admin')
    async getOwners(){
        return this.usersService.getAllOwners();
    }
    @Get('/getOwnerById/:id')
    @Roles('Admin')
    async getOwnerById(@Param('id',ParseIntPipe) id:number){
        return this.usersService.getOwnerById(id);
    }
    @Put('/updateOwner/:id')
    @Roles('Admin')
    async updateOwner(@Param('id',ParseIntPipe) id:number,@Body() dto:any){
        return this.usersService.updateOwner(id,dto);
    }
    @Delete('/deleteOwner/:id')
    @Roles('Admin')
    async deleteOwner(@Param('id',ParseIntPipe) id:number){
        return this.usersService.deleteOwner(id);
    }
}

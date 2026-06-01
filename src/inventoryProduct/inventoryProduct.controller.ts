import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { HttpException, HttpStatus } from "@nestjs/common";
import { InventoryProductService } from "./inventoryProduct.service";
import { AuthGuard } from "src/auth/gaurds/auth.gaurd";
import { Roles } from "src/auth/decorator/roles.decorator";

@Controller('api/inventoryProduct')
@UseGuards(AuthGuard)
@Roles('Admin')
export class InventoryProductController {
    constructor(private inventoryProductService:InventoryProductService){}

    @Get('/getAll')
    public getAllInventoryProducts(){
        return this.inventoryProductService.getAllInventoryProducts();
    }

    @Get('/getById/{:id}')
    public getInventoryProductById(@Param('id',ParseIntPipe) id:number){
        return this.inventoryProductService.findInventoryProductById(id);
    }

    @Post('/create')    
    public createInventoryProduct(@Body() dto:any){
        return this.inventoryProductService.createInventoryProduct(dto);
    }
    @Put('/update/{:id}')
    public updateInventoryProduct(@Param('id',ParseIntPipe) id:number,@Body() dto:any){
        return this.inventoryProductService.updateInventoryProduct(id,dto);
    }
    @Delete('/delete/{:id}')
    public deleteInventoryProduct(@Param('id',ParseIntPipe) id:number){
        return this.inventoryProductService.deleteInventoryProduct(id);
    }
}
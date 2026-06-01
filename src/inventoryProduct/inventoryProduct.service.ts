import { Body, HttpException, HttpStatus, Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInventoryProductDto } from './dto/create-inventoryProduct.dto';
import { UpdateInventoryProductDto } from './dto/update-inventoryProduct.dto';
@Injectable()
export class InventoryProductService {
constructor(private prisma:PrismaService){}
private get prismaClient(){
    return this.prisma as any;
}

async createInventoryProduct(dto: CreateInventoryProductDto) {
    if (!dto.name || dto.quantity === undefined || dto.tradePrice === undefined) {
        throw new HttpException('Missing required fields: name, quantity, and tradePrice are required', HttpStatus.BAD_REQUEST);
    }

    return await this.prismaClient.inventoryProduct.create({
        data: {
            name: dto.name,
            quantity: Number(dto.quantity),
            tradePrice: Number(dto.tradePrice),
        },
    });
}

async getAllInventoryProducts(){
    return await this.prismaClient.inventoryProduct.findMany();
}
async findInventoryProductById(id:number){
    const inventoryProduct= await this.prismaClient.inventoryProduct.findUnique({
        where:{
            id,
        },
    });
    if(!inventoryProduct){
        throw new HttpException('Inventory product not found', HttpStatus.NOT_FOUND);
    }
    return inventoryProduct;
}
async updateInventoryProduct(@Param('id', ParseIntPipe) id: number,@Body() dto: UpdateInventoryProductDto){
    const inventoryProduct= await this.prismaClient.inventoryProduct.findUnique({
        where:{
            id,
        },
    });
    if(!inventoryProduct){
        throw new HttpException('Inventory product not found', HttpStatus.NOT_FOUND);
    }
    return await this.prismaClient.inventoryProduct.update({
        where:{
            id,
        },
        data:{
            quantity:dto.quantity,
            tradePrice:dto.tradePrice,
            name:dto.name,
        },
    });
}

async deleteInventoryProduct(id:number){
    const inventoryProduct= await this.prismaClient.inventoryProduct.findUnique({
        where:{
            id,
        },
    });
    if(!inventoryProduct){
        throw new HttpException('Inventory product not found', HttpStatus.NOT_FOUND);
    }
    return await this.prismaClient.inventoryProduct.delete({
        where:{
            id,
        },
    });
}
}

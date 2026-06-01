import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShopDto } from './create-shop.dto';

@Injectable()
export class ShopsService {
    constructor(private prismaService: PrismaService) {}
    async createShop(dto: CreateShopDto) {
        
        const owner=await this.prismaService.user.findFirst({
            where: {
                id:Number(dto.ownerId),
                role:'Owner',
            }
        })
        if (!owner) {
            throw new HttpException('Owner not found', HttpStatus.NOT_FOUND);
        }
        return this.prismaService.shop.create({
            data: {
                name: dto.name,
                location: dto.location,
                ownerId: dto.ownerId,
            },
            include:{
                Owner:{
                    select:{
                        id:true,
                        email:true,
                        role:true,
                    }
                }
            }
        });
    }

     
async pullProductsToShop(ownerId:number,dto:{
    shopId:number,
    inventoryProductId:number,
    quantity:number,
    addedPrice:number,
}){
    const shop=await this.prismaService.shop.findUnique({
        where:{
            id:dto.shopId,
        },
    })
    if (!shop) {
        throw new HttpException('Shop not found', HttpStatus.NOT_FOUND);
    }
    if (shop.ownerId!==ownerId) {
        throw new ForbiddenException('Not authorized to pull products to this shop');
    }
    const inventoryProduct=await this.prismaService.inventoryProduct.findUnique({
        where:{
            id:dto.inventoryProductId,
        },
    })
    if (!inventoryProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    if (inventoryProduct.quantity<dto.quantity) {
        throw new HttpException('Not enough quantity', HttpStatus.BAD_REQUEST);
    }
    const finalPrice=dto.addedPrice+inventoryProduct.tradePrice;
    const result=await this.prismaService.$transaction(async (tx)=>{
        // انقاص كمية البضاعة في المستودع
        await tx.inventoryProduct.update({
            where:{
                id:dto.inventoryProductId,
            },
            data:{
                quantity:{
                    decrement:dto.quantity,
                },
            }
        })
        // التحقق ان المنتج موجود مسبقا في المتجر لتحديث الكمية 
        const existingProduct=await tx.product.findFirst({
            where:{
                id:dto.inventoryProductId,
                shopId:dto.shopId,
            },
        })
        if (existingProduct) {
            return await tx.product.update({
                where:{
                    id:existingProduct.id,
                },
                data:{
                    quantity:{
                        increment:dto.quantity,
                    },
                    price:finalPrice,
                }
            })
        } else {
            return await tx.product.create({
                data:{
                   name:inventoryProduct.name,
                   inventoryProductId:dto.inventoryProductId,
                   shopId:dto.shopId,
                   quantity:dto.quantity,
                   price:finalPrice,
                }
            })
        }
    })   
    return await this.prismaService.product.findUnique({
        where:{
            id: result.id,
        },
        include:{
            shop:{
                select:{
                    name:true,
                    location:true,
                }
            }
        }
    })
}
}

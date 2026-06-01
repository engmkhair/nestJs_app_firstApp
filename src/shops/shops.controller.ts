import { Body, Controller, Post } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateShopDto } from './create-shop.dto';

@Controller('api/shops')
export class ShopsController {
    constructor(private readonly shopsService: ShopsService) {}
    @Roles('Admin')
    @Post('/create')
    async createShop(@Body() dto: CreateShopDto) {
        return this.shopsService.createShop(dto);
    }
    @Roles('Owner')
    @Post('/pullProductsToShop')
  async pullProductsToShop(@Body() dto: any) {
        return this.shopsService.pullProductsToShop(dto.ownerId,dto);
    }
}

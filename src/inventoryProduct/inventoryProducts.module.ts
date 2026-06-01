import { Module } from '@nestjs/common';
import { InventoryProductController } from './inventoryProduct.controller';
import { InventoryProductService } from './inventoryProduct.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [InventoryProductController],
  providers: [InventoryProductService],
})
export class InventoryProductsModule {}

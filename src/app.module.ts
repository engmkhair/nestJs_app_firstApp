import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { InventoryProductsModule } from './inventoryProduct/inventoryProducts.module';
import { InventoryProductService } from './inventoryProduct/inventoryProduct.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ShopsModule } from './shops/shops.module';
import { ShopsService } from './shops/shops.service';
import { ShopsController } from './shops/shops.controller';
@Module({
  imports: [PrismaModule, AuthModule, ConfigModule.forRoot({
    isGlobal:true
  }), InventoryProductsModule, UsersModule, ShopsModule],
  controllers: [AppController, ShopsController],
  providers: [AppService, PrismaService, InventoryProductService,UsersService, ShopsService],
})
export class AppModule {}

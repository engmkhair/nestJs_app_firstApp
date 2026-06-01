import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateShopDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsNumber()
    ownerId: number;
}

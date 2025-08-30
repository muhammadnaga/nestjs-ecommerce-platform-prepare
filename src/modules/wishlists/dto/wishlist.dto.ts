import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty({ description: 'Product ID', required: false })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({ description: 'Product variant ID', required: false })
  @IsOptional()
  @IsString()
  variantId?: string;
}

export class WishlistItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false })
  productId?: string;

  @ApiProperty({ required: false })
  variantId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  product?: {
    id: string;
    name: string;
    slug: string;
    brand: string | null;
    images: Array<{
      url: string;
      altText: string | null;
    }>;
    variants: Array<{
      id: string;
      name: string;
      sku: string;
      price: number;
      inventoryQty: number;
    }>;
  };

  @ApiProperty({ required: false })
  variant?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    inventoryQty: number;
    product: {
      id: string;
      name: string;
      slug: string;
      brand: string | null;
      images: Array<{
        url: string;
        altText: string | null;
      }>;
    };
  };
}

export class WishlistResponseDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty({ type: [WishlistItemResponseDto] })
  items: WishlistItemResponseDto[];
}

export class MoveToCartDto {
  @ApiProperty({ description: 'Quantity to add to cart', default: 1 })
  @IsOptional()
  quantity?: number = 1;
}

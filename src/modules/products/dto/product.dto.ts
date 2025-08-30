import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class ProductVariantDto {
  @ApiProperty({ description: 'Variant ID' })
  id: string;

  @ApiProperty({ description: 'Variant name' })
  name: string;

  @ApiProperty({ description: 'Variant SKU' })
  sku: string;

  @ApiProperty({ description: 'Variant price', type: Number })
  price: number;

  @ApiPropertyOptional({ description: 'Compare price', type: Number })
  comparePrice?: number;

  @ApiPropertyOptional({ description: 'Cost price', type: Number })
  costPrice?: number;

  @ApiProperty({ description: 'Inventory quantity', type: Number })
  inventoryQty: number;

  @ApiPropertyOptional({ description: 'Weight in grams', type: Number })
  weight?: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class ProductImageDto {
  @ApiProperty({ description: 'Image ID' })
  id: string;

  @ApiProperty({ description: 'Image URL' })
  url: string;

  @ApiPropertyOptional({ description: 'Alt text for accessibility' })
  altText?: string;

  @ApiProperty({ description: 'Image position', type: Number })
  position: number;

  @ApiProperty({ description: 'Is primary image', type: Boolean })
  isPrimary: boolean;

  @ApiPropertyOptional({
    description: 'Variant ID if image is for specific variant',
  })
  variantId?: string;
}

export class ProductAttributeDto {
  @ApiProperty({ description: 'Attribute ID' })
  id: string;

  @ApiProperty({ description: 'Attribute name' })
  name: string;

  @ApiProperty({ description: 'Attribute value' })
  value: string;
}

export class CategoryDto {
  @ApiProperty({ description: 'Category ID' })
  id: string;

  @ApiProperty({ description: 'Category name' })
  name: string;

  @ApiProperty({ description: 'Category slug' })
  slug: string;

  @ApiPropertyOptional({ description: 'Category description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Category image URL' })
  image?: string;

  @ApiProperty({ description: 'Is category active', type: Boolean })
  isActive: boolean;
}

export class SellerDto {
  @ApiProperty({ description: 'Seller ID' })
  id: string;

  @ApiProperty({ description: 'Business name' })
  businessName: string;

  @ApiProperty({ description: 'Commission rate', type: Number })
  commissionRate: number;

  @ApiProperty({ description: 'Seller status' })
  status: string;
}

export class ProductResponseDto {
  @ApiProperty({ description: 'Product ID' })
  id: string;

  @ApiProperty({ description: 'Product name' })
  name: string;

  @ApiProperty({ description: 'Product slug' })
  slug: string;

  @ApiPropertyOptional({ description: 'Product description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Product brand' })
  brand?: string;

  @ApiProperty({ description: 'Product SKU' })
  sku: string;

  @ApiProperty({ description: 'Product status', enum: ProductStatus })
  status: ProductStatus;

  @ApiProperty({ description: 'Product category', type: CategoryDto })
  category: CategoryDto;

  @ApiProperty({ description: 'Product seller', type: SellerDto })
  seller: SellerDto;

  @ApiProperty({ description: 'Product variants', type: [ProductVariantDto] })
  variants: ProductVariantDto[];

  @ApiProperty({ description: 'Product images', type: [ProductImageDto] })
  images: ProductImageDto[];

  @ApiProperty({
    description: 'Product attributes',
    type: [ProductAttributeDto],
  })
  attributes: ProductAttributeDto[];

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class ProductsListResponseDto {
  @ApiProperty({ description: 'List of products', type: [ProductResponseDto] })
  products: ProductResponseDto[];

  @ApiProperty({ description: 'Total number of products', type: Number })
  total: number;

  @ApiProperty({ description: 'Current page', type: Number })
  page: number;

  @ApiProperty({ description: 'Items per page', type: Number })
  limit: number;

  @ApiProperty({ description: 'Total pages', type: Number })
  totalPages: number;
}

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for product name or description',
    example: 'wireless headphones',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description:
      'Category slug(s) to filter by. Can be a single slug or comma-separated list of slugs. Examples: "clothing" for single category, "clothing,electronics,accessories" for multiple categories',
    examples: {
      single: {
        summary: 'Single Category',
        description: 'Filter by one category',
        value: 'clothing',
      },
      multiple: {
        summary: 'Multiple Categories',
        description:
          'Filter by multiple categories (products from any of the specified categories)',
        value: 'clothing,electronics,accessories',
      },
    },
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Brand to filter by',
    example: 'Apple',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    type: Number,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    type: Number,
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Product status', enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Sort by field',
    default: 'createdAt',
    example: 'price',
    enum: ['createdAt', 'name', 'price', 'updatedAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    default: 'desc',
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    type: Number,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page (maximum 100)',
    type: Number,
    default: 20,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category ID' })
  id: string;

  @ApiProperty({ description: 'Category name' })
  name: string;

  @ApiProperty({ description: 'Category slug' })
  slug: string;

  @ApiPropertyOptional({ description: 'Category description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Category image URL' })
  image?: string;

  @ApiProperty({ description: 'Is category active', type: Boolean })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Parent category', type: CategoryDto })
  parent?: CategoryDto;

  @ApiProperty({ description: 'Child categories', type: [CategoryDto] })
  children: CategoryDto[];

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

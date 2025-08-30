import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Public } from '../../common/decorators/public.decorator';
import {
  ProductResponseDto,
  ProductsListResponseDto,
  ProductQueryDto,
} from './dto/product.dto';

@ApiTags('products')
@Controller('products')
@Public()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieve a paginated list of products with optional filtering and sorting. Supports multiple category filtering by providing comma-separated category slugs.',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: ProductsListResponseDto,
    content: {
      'application/json': {
        examples: {
          allProducts: {
            summary: 'All Products',
            description: 'Get all products without any filters',
            value: {
              products: [
                {
                  id: '1',
                  name: 'Classic White T-Shirt',
                  slug: 'classic-white-tshirt',
                  description: 'Comfortable cotton t-shirt',
                  brand: 'Fashion Brand',
                  sku: 'TSH-001',
                  status: 'ACTIVE',
                  category: {
                    id: '1',
                    name: 'Clothing',
                    slug: 'clothing',
                  },
                  variants: [
                    {
                      id: '1',
                      name: 'Medium',
                      sku: 'TSH-001-M',
                      price: 29.99,
                      inventoryQty: 50,
                    },
                  ],
                  images: [
                    {
                      id: '1',
                      url: '/images/tshirt.jpg',
                      altText: 'White T-Shirt',
                      position: 1,
                      isPrimary: true,
                    },
                  ],
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: '2024-01-01T00:00:00Z',
                },
              ],
              total: 1,
              page: 1,
              limit: 20,
              totalPages: 1,
            },
          },
          filteredProducts: {
            summary: 'Filtered Products',
            description: 'Get products filtered by multiple categories',
            value: {
              products: [
                {
                  id: '1',
                  name: 'Classic White T-Shirt',
                  slug: 'classic-white-tshirt',
                  category: { name: 'Clothing', slug: 'clothing' },
                  variants: [{ price: 29.99 }],
                  images: [{ url: '/images/tshirt.jpg' }],
                },
                {
                  id: '2',
                  name: 'Smartphone X',
                  slug: 'smartphone-x',
                  category: { name: 'Electronics', slug: 'electronics' },
                  variants: [{ price: 599.99 }],
                  images: [{ url: '/images/phone.jpg' }],
                },
              ],
              total: 2,
              page: 1,
              limit: 20,
              totalPages: 1,
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Get product by slug',
    description:
      'Retrieve a specific product by its slug with all related data',
  })
  @ApiParam({
    name: 'slug',
    description: 'Product slug (URL-friendly identifier)',
    example: 'wireless-bluetooth-headphones',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }
}

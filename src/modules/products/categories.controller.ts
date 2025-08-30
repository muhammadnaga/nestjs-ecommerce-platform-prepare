import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Public } from '../../common/decorators/public.decorator';
import { CategoryResponseDto } from './dto/product.dto';

@ApiTags('products')
@Controller('categories')
@Public()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description:
      'Retrieve all product categories with their hierarchy. Use these category slugs for filtering products.',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [CategoryResponseDto],
    content: {
      'application/json': {
        examples: {
          categories: {
            summary: 'Available Categories',
            description: 'List of all available categories for filtering',
            value: [
              {
                id: '1',
                name: 'Clothing',
                slug: 'clothing',
                description: 'Fashion and apparel items',
                isActive: true,
                children: [],
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
              {
                id: '2',
                name: 'Electronics',
                slug: 'electronics',
                description: 'Electronic devices and gadgets',
                isActive: true,
                children: [],
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
              {
                id: '3',
                name: 'Smartphones',
                slug: 'smartphones',
                description: 'Mobile phones and accessories',
                isActive: true,
                children: [],
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
            ],
          },
        },
      },
    },
  })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieve a specific category by its ID with child categories',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      // Support multiple categories separated by commas
      const categorySlugs = category
        .split(',')
        .map((slug) => slug.trim())
        .filter(Boolean);

      if (categorySlugs.length === 1) {
        // Single category filter
        where.category = { slug: categorySlugs[0] };
      } else if (categorySlugs.length > 1) {
        // Multiple categories filter - products that belong to ANY of the selected categories
        where.category = {
          slug: {
            in: categorySlugs,
          },
        };
      }
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }

    if (status) {
      where.status = status;
    }

    if (minPrice || maxPrice) {
      where.variants = {
        some: {
          ...(minPrice && { price: { gte: minPrice } }),
          ...(maxPrice && { price: { lte: maxPrice } }),
        },
      };
    }

    // Get total count
    const total = await this.prisma.product.count({ where });

    // Get products with pagination
    const products = await this.prisma.product.findMany({
      where,
      include: {
        variants: true,
        images: true,
        category: true,
        seller: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        images: true,
        attributes: true,
        category: true,
        seller: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  RegisterSellerDto,
  UpdateSellerProfileDto,
  UpdateSellerStatusDto,
  SellerResponseDto,
  SellerDashboardDto,
} from './dto/seller.dto';
import { SellerStatus, UserRole } from '@prisma/client';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async registerSeller(
    userId: string,
    registerDto: RegisterSellerDto,
  ): Promise<SellerResponseDto> {
    const { businessName, taxId, documents, bankDetails } = registerDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a seller
    const existingSeller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (existingSeller) {
      throw new ConflictException('User is already registered as a seller');
    }

    // Check if tax ID is already taken
    const existingTaxId = await this.prisma.seller.findUnique({
      where: { taxId },
    });

    if (existingTaxId) {
      throw new ConflictException('Tax ID is already registered');
    }

    // Create seller record
    const seller = await this.prisma.seller.create({
      data: {
        userId,
        businessName,
        taxId,
        documents,
        bankDetails,
        status: SellerStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
            phone: true,
          },
        },
      },
    });

    // Update user role to SELLER
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.SELLER },
    });

    return this.formatSellerResponse(seller);
  }

  async getSellerProfile(userId: string): Promise<SellerResponseDto> {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
            phone: true,
          },
        },
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller profile not found');
    }

    return this.formatSellerResponse(seller);
  }

  async updateSellerProfile(
    userId: string,
    updateDto: UpdateSellerProfileDto,
  ): Promise<SellerResponseDto> {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      throw new NotFoundException('Seller profile not found');
    }

    const updatedSeller = await this.prisma.seller.update({
      where: { userId },
      data: updateDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
            phone: true,
          },
        },
      },
    });

    return this.formatSellerResponse(updatedSeller);
  }

  async getSellerDashboard(userId: string): Promise<SellerDashboardDto> {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      throw new NotFoundException('Seller profile not found');
    }

    // Get product statistics
    const totalProducts = await this.prisma.product.count({
      where: { sellerId: seller.id },
    });

    const activeProducts = await this.prisma.product.count({
      where: {
        sellerId: seller.id,
        status: 'ACTIVE',
      },
    });

    // Get order statistics
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            variant: {
              product: {
                sellerId: seller.id,
              },
            },
          },
        },
      },
      include: {
        items: {
          where: {
            variant: {
              product: {
                sellerId: seller.id,
              },
            },
          },
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
            profile: true,
          },
        },
      },
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (order) => order.status === 'PENDING',
    ).length;

    // Calculate revenue
    let totalRevenue = 0;
    let thisMonthRevenue = 0;
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    for (const order of orders) {
      for (const item of order.items) {
        const itemTotal = item.price.toNumber() * item.quantity;
        totalRevenue += itemTotal;

        if (order.createdAt >= currentMonth) {
          thisMonthRevenue += itemTotal;
        }
      }
    }

    // Get recent orders (last 10)
    const recentOrders = orders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.items.reduce(
          (sum, item) => sum + item.price.toNumber() * item.quantity,
          0,
        ),
        status: order.status,
        createdAt: order.createdAt,
        customer: {
          email: order.user.email,
          profile: order.user.profile,
        },
      }));

    // Get top products
    const productSales = new Map<
      string,
      { product: any; totalSold: number; revenue: number }
    >();

    for (const order of orders) {
      for (const item of order.items) {
        const productId = item.variant.product.id;
        const existing = productSales.get(productId);

        if (existing) {
          existing.totalSold += item.quantity;
          existing.revenue += item.price.toNumber() * item.quantity;
        } else {
          productSales.set(productId, {
            product: item.variant.product,
            totalSold: item.quantity,
            revenue: item.price.toNumber() * item.quantity,
          });
        }
      }
    }

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((item) => ({
        id: item.product.id,
        name: item.product.name,
        totalSold: item.totalSold,
        revenue: item.revenue,
      }));

    // Get average rating
    const reviews = await this.prisma.review.findMany({
      where: {
        product: {
          sellerId: seller.id,
        },
      },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      thisMonthRevenue,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
      recentOrders,
      topProducts,
    };
  }

  async getAllSellers() {
    const sellers = await this.prisma.seller.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sellers.map((seller) => this.formatSellerResponse(seller));
  }

  async updateSellerStatus(
    sellerId: string,
    updateDto: UpdateSellerStatusDto,
  ): Promise<SellerResponseDto> {
    const { status, commissionRate } = updateDto;

    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    const updateData: any = { status };
    if (commissionRate !== undefined) {
      updateData.commissionRate = commissionRate;
    }

    const updatedSeller = await this.prisma.seller.update({
      where: { id: sellerId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
            phone: true,
          },
        },
      },
    });

    return this.formatSellerResponse(updatedSeller);
  }

  private formatSellerResponse(seller: any): SellerResponseDto {
    return {
      id: seller.id,
      userId: seller.userId,
      businessName: seller.businessName,
      taxId: seller.taxId,
      commissionRate: seller.commissionRate.toNumber(),
      status: seller.status,
      documents: seller.documents,
      bankDetails: seller.bankDetails,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
      user: seller.user,
    };
  }
}

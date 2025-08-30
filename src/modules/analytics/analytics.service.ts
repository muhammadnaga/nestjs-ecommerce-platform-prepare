import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalProducts, totalOrders, totalRevenue] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.product.count({ where: { status: 'ACTIVE' } }),
        this.prisma.order.count(),
        this.prisma.payment.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true },
        }),
      ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  }

  async getOrderStats() {
    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return ordersByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));
  }
}

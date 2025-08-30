/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewResponseDto,
  ProductReviewsResponseDto,
  ReviewQueryDto,
} from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(
    userId: string,
    createDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const { productId, rating, title, content } = createDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await this.prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // Check if user purchased this product (verified purchase)
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        variant: {
          productId,
        },
        order: {
          userId,
          status: 'DELIVERED',
        },
      },
    });

    // Create review
    const review = await this.prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        title,
        content,
        verifiedPurchase: !!hasPurchased,
      },
      include: {
        user: {
          select: {
            id: true,
            profile: true,
          },
        },
      },
    });

    return this.formatReviewResponse(review);
  }

  async getProductReviews(
    productId: string,
    query: ReviewQueryDto,
  ): Promise<ProductReviewsResponseDto> {
    const {
      page = 1,
      limit = 10,
      rating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Build where clause
    const where: any = { productId };
    if (rating) {
      where.rating = rating;
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'helpful') {
      orderBy.helpfulVotes = sortOrder;
    } else if (sortBy === 'rating') {
      orderBy.rating = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Get reviews
    const reviews = await this.prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            profile: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    // Get total count
    const totalReviews = await this.prisma.review.count({
      where: { productId },
    });

    // Calculate average rating
    const avgResult = await this.prisma.review.aggregate({
      where: { productId },
      _avg: {
        rating: true,
      },
    });

    const averageRating = avgResult._avg.rating || 0;

    // Get rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const ratingCounts = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { productId },
      _count: {
        rating: true,
      },
    });

    for (const count of ratingCounts) {
      ratingDistribution[count.rating as keyof typeof ratingDistribution] =
        count._count.rating;
    }

    return {
      productId,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      reviews: reviews.map((review) => this.formatReviewResponse(review)),
    };
  }

  async getUserReviews(
    userId: string,
    query: ReviewQueryDto,
  ): Promise<ReviewResponseDto[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'helpful') {
      orderBy.helpfulVotes = sortOrder;
    } else if (sortBy === 'rating') {
      orderBy.rating = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const reviews = await this.prisma.review.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            profile: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    return reviews.map((review) => this.formatReviewResponse(review));
  }

  async updateReview(
    userId: string,
    reviewId: string,
    updateDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    // Check if review exists and belongs to user
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    // Update review
    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: updateDto,
      include: {
        user: {
          select: {
            id: true,
            profile: true,
          },
        },
      },
    });

    return this.formatReviewResponse(updatedReview);
  }

  async deleteReview(
    userId: string,
    reviewId: string,
  ): Promise<{ message: string }> {
    // Check if review exists and belongs to user
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    // Delete review
    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    return { message: 'Review deleted successfully' };
  }

  async markReviewHelpful(
    userId: string,
    reviewId: string,
  ): Promise<ReviewResponseDto> {
    // Check if review exists
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Users cannot mark their own reviews as helpful
    if (review.userId === userId) {
      throw new BadRequestException(
        'You cannot mark your own review as helpful',
      );
    }

    // For simplicity, we'll just increment the helpful votes
    // In a real app, you'd track which users voted to prevent duplicate votes
    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulVotes: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            profile: true,
          },
        },
      },
    });

    return this.formatReviewResponse(updatedReview);
  }

  private formatReviewResponse(review: any): ReviewResponseDto {
    return {
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      title: review.title,
      content: review.content,
      verifiedPurchase: review.verifiedPurchase,
      helpfulVotes: review.helpfulVotes,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: review.user,
      product: review.product,
    };
  }
}

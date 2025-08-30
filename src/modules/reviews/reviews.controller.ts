import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import {
  CurrentUser,
  type CurrentUserType,
} from '../../common/decorators/current-user.decorator';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewResponseDto,
  ProductReviewsResponseDto,
  ReviewQueryDto,
} from './dto/review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a product review' })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Already reviewed this product' })
  async createReview(
    @CurrentUser() user: CurrentUserType,
    @Body() createDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(user.id, createDto);
  }

  @Get('product/:productId')
  @Public()
  @ApiOperation({ summary: 'Get reviews for a product' })
  @ApiResponse({
    status: 200,
    description: 'Product reviews retrieved successfully',
    type: ProductReviewsResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'rating', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getProductReviews(
    @Param('productId') productId: string,
    @Query() query: ReviewQueryDto,
  ) {
    return this.reviewsService.getProductReviews(productId, query);
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user reviews' })
  @ApiResponse({
    status: 200,
    description: 'User reviews retrieved successfully',
    type: [ReviewResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getUserReviews(
    @CurrentUser() user: CurrentUserType,
    @Query() query: ReviewQueryDto,
  ) {
    return this.reviewsService.getUserReviews(user.id, query);
  }

  @Put(':reviewId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 403, description: 'Can only update own reviews' })
  async updateReview(
    @CurrentUser() user: CurrentUserType,
    @Param('reviewId') reviewId: string,
    @Body() updateDto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(user.id, reviewId, updateDto);
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 403, description: 'Can only delete own reviews' })
  async deleteReview(
    @CurrentUser() user: CurrentUserType,
    @Param('reviewId') reviewId: string,
  ) {
    return this.reviewsService.deleteReview(user.id, reviewId);
  }

  @Put(':reviewId/helpful')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark review as helpful' })
  @ApiResponse({
    status: 200,
    description: 'Review marked as helpful',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot mark own review as helpful',
  })
  async markReviewHelpful(
    @CurrentUser() user: CurrentUserType,
    @Param('reviewId') reviewId: string,
  ) {
    return this.reviewsService.markReviewHelpful(user.id, reviewId);
  }
}

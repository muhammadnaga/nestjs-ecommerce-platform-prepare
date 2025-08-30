import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserType,
} from '../../common/decorators/current-user.decorator';
import {
  AddToWishlistDto,
  WishlistItemResponseDto,
  WishlistResponseDto,
  MoveToCartDto,
} from './dto/wishlist.dto';

@ApiTags('wishlists')
@Controller('wishlists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @ApiOperation({ summary: 'Add item to wishlist' })
  @ApiResponse({
    status: 201,
    description: 'Item added to wishlist successfully',
    type: WishlistItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product or variant not found' })
  @ApiResponse({ status: 409, description: 'Item already in wishlist' })
  async addToWishlist(
    @CurrentUser() user: CurrentUserType,
    @Body() addDto: AddToWishlistDto,
  ) {
    return this.wishlistsService.addToWishlist(user.id, addDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist retrieved successfully',
    type: WishlistResponseDto,
  })
  async getWishlist(@CurrentUser() user: CurrentUserType) {
    return this.wishlistsService.getWishlist(user.id);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from wishlist successfully',
  })
  @ApiResponse({ status: 404, description: 'Wishlist item not found' })
  async removeFromWishlist(
    @CurrentUser() user: CurrentUserType,
    @Param('itemId') itemId: string,
  ) {
    return this.wishlistsService.removeFromWishlist(user.id, itemId);
  }

  @Post(':itemId/move-to-cart')
  @ApiOperation({ summary: 'Move wishlist item to cart' })
  @ApiResponse({
    status: 200,
    description: 'Item moved to cart successfully',
  })
  @ApiResponse({ status: 404, description: 'Wishlist item not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot move to cart or insufficient stock',
  })
  async moveToCart(
    @CurrentUser() user: CurrentUserType,
    @Param('itemId') itemId: string,
    @Body() moveDto: MoveToCartDto,
  ) {
    return this.wishlistsService.moveToCart(user.id, itemId, moveDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist cleared successfully',
  })
  async clearWishlist(@CurrentUser() user: CurrentUserType) {
    return this.wishlistsService.clearWishlist(user.id);
  }
}

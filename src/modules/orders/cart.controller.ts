import {
  Controller,
  Get,
  Post,
  Put,
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
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserType,
} from '../../common/decorators/current-user.decorator';
import {
  AddToCartDto,
  UpdateCartItemDto,
  ApplyCouponDto,
  CartResponseDto,
} from './dto/cart.dto';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart with totals' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  async getCart(@CurrentUser() user: CurrentUserType) {
    return this.cartService.getCart(user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  async addToCart(
    @CurrentUser() user: CurrentUserType,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(user.id, addToCartDto);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  async updateCartItem(
    @CurrentUser() user: CurrentUserType,
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(user.id, itemId, updateDto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeCartItem(
    @CurrentUser() user: CurrentUserType,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeCartItem(user.id, itemId);
  }

  @Post('coupon/apply')
  @ApiOperation({ summary: 'Apply coupon to cart' })
  @ApiResponse({
    status: 200,
    description: 'Coupon applied successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Invalid coupon' })
  @ApiResponse({ status: 400, description: 'Coupon requirements not met' })
  async applyCoupon(
    @CurrentUser() user: CurrentUserType,
    @Body() applyCouponDto: ApplyCouponDto,
  ) {
    return this.cartService.applyCoupon(user.id, applyCouponDto);
  }

  @Delete('coupon')
  @ApiOperation({ summary: 'Remove coupon from cart' })
  @ApiResponse({
    status: 200,
    description: 'Coupon removed successfully',
    type: CartResponseDto,
  })
  async removeCoupon(@CurrentUser() user: CurrentUserType) {
    return this.cartService.removeCoupon(user.id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(@CurrentUser() user: CurrentUserType) {
    return this.cartService.clearCart(user.id);
  }
}

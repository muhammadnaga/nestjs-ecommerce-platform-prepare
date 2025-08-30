/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AddToCartDto,
  UpdateCartItemDto,
  ApplyCouponDto,
  CartResponseDto,
} from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string): Promise<CartResponseDto> {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return this.calculateCartTotals(cart);
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { variantId, quantity } = addToCartDto;

    // Check if variant exists and has enough stock
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    if (variant.inventoryQty < quantity) {
      throw new BadRequestException(
        `Only ${variant.inventoryQty} items available in stock`,
      );
    }

    // Get or create cart
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (variant.inventoryQty < newQuantity) {
        throw new BadRequestException(
          `Only ${variant.inventoryQty} items available in stock`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          priceSnapshot: variant.price,
        },
      });
    } else {
      // Create new cart item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
          priceSnapshot: variant.price,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateDto;

    // Find cart item
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: {
        variant: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock availability
    if (cartItem.variant.inventoryQty < quantity) {
      throw new BadRequestException(
        `Only ${cartItem.variant.inventoryQty} items available in stock`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        priceSnapshot: cartItem.variant.price, // Update price in case it changed
      },
    });

    return this.getCart(userId);
  }

  async removeCartItem(userId: string, itemId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  async applyCoupon(userId: string, applyCouponDto: ApplyCouponDto) {
    const { code } = applyCouponDto;

    // Validate coupon
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      throw new NotFoundException('Invalid or inactive coupon');
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Coupon usage limit exceeded');
    }

    // Get cart
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Calculate cart subtotal to check minimum amount
    const cartWithTotals = await this.getCart(userId);

    if (
      coupon.minAmount &&
      cartWithTotals.subtotal < coupon.minAmount.toNumber()
    ) {
      throw new BadRequestException(
        `Minimum order amount of $${coupon.minAmount.toNumber()} required`,
      );
    }

    // Apply coupon to cart
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponCode: code },
    });

    return this.getCart(userId);
  }

  async removeCoupon(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponCode: null },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponCode: null },
    });

    return { message: 'Cart cleared successfully' };
  }

  private async calculateCartTotals(cart: any): Promise<CartResponseDto> {
    let subtotal = 0;
    let discount = 0;

    // Calculate subtotal
    for (const item of cart.items) {
      subtotal += item.priceSnapshot.toNumber() * item.quantity;
    }

    // Calculate discount if coupon is applied
    if (cart.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: cart.couponCode },
      });

      if (coupon && coupon.isActive) {
        if (coupon.type === 'PERCENTAGE') {
          discount = (subtotal * coupon.value.toNumber()) / 100;
        } else if (coupon.type === 'FIXED_AMOUNT') {
          discount = Math.min(coupon.value.toNumber(), subtotal);
        }
      }
    }

    const total = subtotal - discount;

    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.priceSnapshot.toNumber(),
        variant: {
          id: item.variant.id,
          sku: item.variant.sku,
          price: item.variant.price.toNumber(),
          stock: item.variant.inventoryQty,
          product: {
            id: item.variant.product.id,
            name: item.variant.product.name,
            slug: item.variant.product.slug,
            images: item.variant.product.images.map((img: any) => ({
              url: img.url,
              alt: img.altText || img.alt || '',
            })),
          },
        },
      })),
      couponCode: cart.couponCode,
      discount,
      subtotal,
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}

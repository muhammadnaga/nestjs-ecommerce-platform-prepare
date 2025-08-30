/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AddToWishlistDto,
  WishlistItemResponseDto,
  WishlistResponseDto,
  MoveToCartDto,
} from './dto/wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(private prisma: PrismaService) {}

  async addToWishlist(
    userId: string,
    addDto: AddToWishlistDto,
  ): Promise<WishlistItemResponseDto> {
    const { productId, variantId } = addDto;

    // Must specify either productId or variantId
    if (!productId && !variantId) {
      throw new BadRequestException(
        'Must specify either productId or variantId',
      );
    }

    // Cannot specify both
    if (productId && variantId) {
      throw new BadRequestException(
        'Cannot specify both productId and variantId',
      );
    }

    // Check if product/variant exists
    if (productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Check if already in wishlist
      const existing = await this.prisma.wishlist.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Product already in wishlist');
      }
    }

    if (variantId) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: variantId },
      });
      if (!variant) {
        throw new NotFoundException('Product variant not found');
      }

      // Check if already in wishlist
      const existing = await this.prisma.wishlist.findUnique({
        where: {
          userId_variantId: {
            userId,
            variantId,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Product variant already in wishlist');
      }
    }

    // Add to wishlist
    const wishlistItem = await this.prisma.wishlist.create({
      data: {
        userId,
        productId,
        variantId,
      },
      include: {
        product: productId
          ? {
              include: {
                images: {
                  orderBy: { position: 'asc' },
                  take: 1,
                },
                variants: {
                  orderBy: { price: 'asc' },
                },
              },
            }
          : false,
        variant: variantId
          ? {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: { position: 'asc' },
                      take: 1,
                    },
                  },
                },
              },
            }
          : false,
      },
    });

    return this.formatWishlistItem(wishlistItem);
  }

  async getWishlist(userId: string): Promise<WishlistResponseDto> {
    const items = await this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              orderBy: { position: 'asc' },
              take: 1,
            },
            variants: {
              orderBy: { price: 'asc' },
            },
          },
        },
        variant: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { position: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalItems: items.length,
      items: items.map((item) => this.formatWishlistItem(item)),
    };
  }

  async removeFromWishlist(
    userId: string,
    wishlistItemId: string,
  ): Promise<{ message: string }> {
    // Check if item exists and belongs to user
    const item = await this.prisma.wishlist.findFirst({
      where: {
        id: wishlistItemId,
        userId,
      },
    });

    if (!item) {
      throw new NotFoundException('Wishlist item not found');
    }

    // Remove from wishlist
    await this.prisma.wishlist.delete({
      where: { id: wishlistItemId },
    });

    return { message: 'Item removed from wishlist successfully' };
  }

  async moveToCart(
    userId: string,
    wishlistItemId: string,
    moveDto: MoveToCartDto,
  ): Promise<{ message: string }> {
    const { quantity = 1 } = moveDto;

    // Get wishlist item
    const wishlistItem = await this.prisma.wishlist.findFirst({
      where: {
        id: wishlistItemId,
        userId,
      },
      include: {
        variant: true,
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    // For product-only wishlist items, we need to select a variant
    if (!wishlistItem.variantId) {
      throw new BadRequestException(
        'Cannot move product to cart without selecting a variant',
      );
    }

    // Check stock availability
    if (wishlistItem.variant && wishlistItem.variant.inventoryQty < quantity) {
      throw new BadRequestException(
        `Only ${wishlistItem.variant.inventoryQty} items available in stock`,
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
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId: wishlistItem.variantId,
      },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;

      if (
        wishlistItem.variant &&
        wishlistItem.variant.inventoryQty < newQuantity
      ) {
        throw new BadRequestException(
          `Only ${wishlistItem.variant.inventoryQty} items available in stock`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
          priceSnapshot: wishlistItem.variant?.price,
        },
      });
    } else {
      // Create new cart item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: wishlistItem.variantId!,
          quantity,
          priceSnapshot: wishlistItem.variant?.price || 0,
        },
      });
    }

    // Remove from wishlist
    await this.prisma.wishlist.delete({
      where: { id: wishlistItemId },
    });

    return { message: 'Item moved to cart successfully' };
  }

  async clearWishlist(userId: string): Promise<{ message: string }> {
    await this.prisma.wishlist.deleteMany({
      where: { userId },
    });

    return { message: 'Wishlist cleared successfully' };
  }

  private formatWishlistItem(item: any): WishlistItemResponseDto {
    const formattedItem: WishlistItemResponseDto = {
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      variantId: item.variantId,
      createdAt: item.createdAt,
    };

    if (item.product) {
      formattedItem.product = {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        brand: item.product.brand,
        images: item.product.images.map((img: any) => ({
          url: img.url,
          altText: img.altText,
        })),
        variants: item.product.variants.map((variant: any) => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: variant.price.toNumber(),
          inventoryQty: variant.inventoryQty,
        })),
      };
    }

    if (item.variant) {
      formattedItem.variant = {
        id: item.variant.id,
        name: item.variant.name,
        sku: item.variant.sku,
        price: item.variant.price.toNumber(),
        inventoryQty: item.variant.inventoryQty,
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
          slug: item.variant.product.slug,
          brand: item.variant.product.brand,
          images: item.variant.product.images.map((img: any) => ({
            url: img.url,
            altText: img.altText,
          })),
        },
      };
    }

    return formattedItem;
  }
}

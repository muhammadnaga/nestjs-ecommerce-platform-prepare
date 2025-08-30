import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPasswordHash = await argon2.hash('admin123');
  await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      emailVerified: true,
      profile: {
        firstName: 'Admin',
        lastName: 'User',
      },
    },
  });

  // Create customer user
  const customerPasswordHash = await argon2.hash('customer123');
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      emailVerified: true,
      phone: '+1234567890',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
      },
    },
  });

  // Create seller user
  const sellerPasswordHash = await argon2.hash('seller123');
  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      passwordHash: sellerPasswordHash,
      role: 'SELLER',
      emailVerified: true,
      phone: '+1234567891',
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
      },
    },
  });

  // Create seller profile
  const seller = await prisma.seller.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      businessName: 'Tech Store Inc.',
      taxId: 'TAX123456789',
      commissionRate: 15.0,
      status: 'APPROVED',
      bankDetails: {
        accountNumber: '1234567890',
        routingNumber: '987654321',
        bankName: 'Example Bank',
      },
    },
  });

  // Create categories
  const electronicsCategory = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      isActive: true,
    },
  });

  const smartphonesCategory = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories',
      parentId: electronicsCategory.id,
      isActive: true,
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      isActive: true,
    },
  });

  // Create products
  const iphoneProduct = await prisma.product.upsert({
    where: { slug: 'iphone-15-pro' },
    update: {},
    create: {
      sellerId: seller.id,
      categoryId: smartphonesCategory.id,
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'The latest iPhone with advanced features',
      brand: 'Apple',
      sku: 'IPHONE15PRO',
      status: 'ACTIVE',
    },
  });

  const tshirtProduct = await prisma.product.upsert({
    where: { slug: 'cotton-t-shirt' },
    update: {},
    create: {
      sellerId: seller.id,
      categoryId: clothingCategory.id,
      name: 'Cotton T-Shirt',
      slug: 'cotton-t-shirt',
      description: 'Comfortable 100% cotton t-shirt',
      brand: 'Generic',
      sku: 'TSHIRT001',
      status: 'ACTIVE',
    },
  });

  // Create product variants
  await prisma.productVariant.createMany({
    data: [
      {
        productId: iphoneProduct.id,
        name: 'iPhone 15 Pro - 128GB - Natural Titanium',
        sku: 'IPHONE15PRO-128-NT',
        price: 999.99,
        comparePrice: 1099.99,
        costPrice: 750.0,
        inventoryQty: 50,
        weight: 0.187,
      },
      {
        productId: iphoneProduct.id,
        name: 'iPhone 15 Pro - 256GB - Natural Titanium',
        sku: 'IPHONE15PRO-256-NT',
        price: 1199.99,
        comparePrice: 1299.99,
        costPrice: 900.0,
        inventoryQty: 30,
        weight: 0.187,
      },
      {
        productId: tshirtProduct.id,
        name: 'Cotton T-Shirt - Size M - Blue',
        sku: 'TSHIRT001-M-BLUE',
        price: 29.99,
        comparePrice: 39.99,
        costPrice: 15.0,
        inventoryQty: 100,
        weight: 0.2,
      },
      {
        productId: tshirtProduct.id,
        name: 'Cotton T-Shirt - Size L - Blue',
        sku: 'TSHIRT001-L-BLUE',
        price: 29.99,
        comparePrice: 39.99,
        costPrice: 15.0,
        inventoryQty: 75,
        weight: 0.22,
      },
    ],
    skipDuplicates: true,
  });

  // Create product attributes
  await prisma.productAttribute.createMany({
    data: [
      {
        productId: iphoneProduct.id,
        name: 'Color',
        value: 'Natural Titanium',
      },
      {
        productId: iphoneProduct.id,
        name: 'Screen Size',
        value: '6.1 inches',
      },
      {
        productId: tshirtProduct.id,
        name: 'Material',
        value: '100% Cotton',
      },
      {
        productId: tshirtProduct.id,
        name: 'Fit',
        value: 'Regular',
      },
    ],
    skipDuplicates: true,
  });

  // Create customer address
  await prisma.address.upsert({
    where: { id: 'seed-address-1' },
    update: {},
    create: {
      id: 'seed-address-1',
      userId: customer.id,
      type: 'SHIPPING',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      isDefault: true,
    },
  });

  // Create coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10.0,
        minAmount: 50.0,
        maxUses: 1000,
        usedCount: 0,
        expiresAt: new Date('2025-12-31'),
        isActive: true,
      },
      {
        code: 'SAVE20',
        type: 'FIXED_AMOUNT',
        value: 20.0,
        minAmount: 100.0,
        maxUses: 500,
        usedCount: 0,
        expiresAt: new Date('2025-06-30'),
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📧 Test Users:');
  console.log('Admin: admin@ecommerce.com / admin123');
  console.log('Customer: customer@example.com / customer123');
  console.log('Seller: seller@example.com / seller123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

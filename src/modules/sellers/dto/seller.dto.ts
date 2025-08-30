import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsObject,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { SellerStatus } from '@prisma/client';

export class RegisterSellerDto {
  @ApiProperty({ description: 'Business name' })
  @IsString()
  businessName: string;

  @ApiProperty({ description: 'Tax identification number' })
  @IsString()
  taxId: string;

  @ApiProperty({
    description: 'Business documents (JSON format)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  documents?: Record<string, any>;

  @ApiProperty({
    description: 'Bank account details (JSON format)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  bankDetails?: Record<string, any>;
}

export class UpdateSellerProfileDto {
  @ApiProperty({ description: 'Business name', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({
    description: 'Business documents (JSON format)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  documents?: Record<string, any>;

  @ApiProperty({
    description: 'Bank account details (JSON format)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  bankDetails?: Record<string, any>;
}

export class UpdateSellerStatusDto {
  @ApiProperty({
    description: 'Seller status',
    enum: SellerStatus,
  })
  @IsEnum(SellerStatus)
  status: SellerStatus;

  @ApiProperty({
    description: 'Commission rate (percentage)',
    minimum: 0,
    maximum: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  commissionRate?: number;
}

export class SellerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  businessName: string;

  @ApiProperty()
  taxId: string;

  @ApiProperty()
  commissionRate: number;

  @ApiProperty({ enum: SellerStatus })
  status: SellerStatus;

  @ApiProperty({ required: false })
  documents?: Record<string, any>;

  @ApiProperty({ required: false })
  bankDetails?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    profile: any;
    phone: string | null;
  };
}

export class SellerDashboardDto {
  @ApiProperty()
  totalProducts: number;

  @ApiProperty()
  activeProducts: number;

  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  pendingOrders: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  thisMonthRevenue: number;

  @ApiProperty()
  averageRating: number;

  @ApiProperty()
  totalReviews: number;

  @ApiProperty()
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: Date;
    customer: {
      email: string;
      profile: any;
    };
  }>;

  @ApiProperty()
  topProducts: Array<{
    id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
}

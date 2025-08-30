import {
  Controller,
  Get,
  Post,
  Put,
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
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  CurrentUser,
  type CurrentUserType,
} from '../../common/decorators/current-user.decorator';
import {
  RegisterSellerDto,
  UpdateSellerProfileDto,
  UpdateSellerStatusDto,
  SellerResponseDto,
  SellerDashboardDto,
} from './dto/seller.dto';
import { UserRole } from '@prisma/client';

@ApiTags('sellers')
@Controller('sellers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register as a seller' })
  @ApiResponse({
    status: 201,
    description: 'Seller registration successful',
    type: SellerResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already registered as seller',
  })
  async registerSeller(
    @CurrentUser() user: CurrentUserType,
    @Body() registerDto: RegisterSellerDto,
  ) {
    return this.sellersService.registerSeller(user.id, registerDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get seller profile' })
  @ApiResponse({
    status: 200,
    description: 'Seller profile retrieved successfully',
    type: SellerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Seller profile not found' })
  async getSellerProfile(@CurrentUser() user: CurrentUserType) {
    return this.sellersService.getSellerProfile(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update seller profile' })
  @ApiResponse({
    status: 200,
    description: 'Seller profile updated successfully',
    type: SellerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Seller profile not found' })
  async updateSellerProfile(
    @CurrentUser() user: CurrentUserType,
    @Body() updateDto: UpdateSellerProfileDto,
  ) {
    return this.sellersService.updateSellerProfile(user.id, updateDto);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get seller dashboard data' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: SellerDashboardDto,
  })
  @ApiResponse({ status: 404, description: 'Seller profile not found' })
  async getSellerDashboard(@CurrentUser() user: CurrentUserType) {
    return this.sellersService.getSellerDashboard(user.id);
  }

  // Admin endpoints
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all sellers (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Sellers retrieved successfully',
    type: [SellerResponseDto],
  })
  async getAllSellers() {
    return this.sellersService.getAllSellers();
  }

  @Put(':sellerId/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update seller status (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Seller status updated successfully',
    type: SellerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  async updateSellerStatus(
    @Param('sellerId') sellerId: string,
    @Body() updateDto: UpdateSellerStatusDto,
  ) {
    return this.sellersService.updateSellerStatus(sellerId, updateDto);
  }
}

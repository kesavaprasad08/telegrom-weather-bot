import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from '../schemas/user.schema';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/users')
  async getUsers(): Promise<User[]> {
    return await this.adminService.findAllUsers();
  }
  @Post('users/block')
  async blockUser(@Body('telegramId') telegramId: string): Promise<any> {
    return await this.adminService.blockUser(telegramId);
  }
  @Post('users/unblock')
  async unBlockUser(@Body('telegramId') telegramId: string): Promise<any> {
    return await this.adminService.unBlockUser(telegramId);
  }

  @Delete('users/:id/delete')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.adminService.deleteUser(id);
  }
  @Post('users/update-telegram-bot-token')
  async updateTelegramBotToken(@Body() body: { token: string }) {
    const { token } = body;
    return this.adminService.updateTelegramBotToken(token);
  }
  @Post('users/update-open-weather-api-key')
  async updateOpenWeatherApiKey(@Body() body: { token: string }) {
    const { token } = body;
    return this.adminService.updateOpenWeatherApiKey(token);
  }
}

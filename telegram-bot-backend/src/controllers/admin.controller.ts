
import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from '../schemas/user.schema';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('users')
    async getUsers(): Promise<User[]> {
        console.log('Received request to get users'); // Log when the endpoint is hit
        return await this.adminService.findAllUsers();
    }
    @Post('users/block')
    async blockUser(@Body('telegramId') telegramId: string): Promise<any> {
        return await this.adminService.blockUser(telegramId);
    }

    @Delete('users/:id/delete')
    async deleteUser(@Param('id') id: string): Promise<any> {
        return await this.adminService.deleteUser(id);
    }
    
}

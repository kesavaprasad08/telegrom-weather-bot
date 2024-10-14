import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserModule } from 'src/schemas/user.module';
import { AdminController } from './admin.controller';
import { ConfigModule } from 'src/schemas/config.model';

@Module({
  controllers: [AdminController],
  imports: [UserModule, ConfigModule],
  providers: [AdminService],
})
export class AdminModule {}

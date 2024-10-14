
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AdminService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async blockUser(telegramId: string): Promise<any> {
        return this.userModel.updateOne({ telegramId }, { isActive: false });
    }

    async deleteUser(id: string): Promise<any> {
        return this.userModel.findByIdAndDelete(id);
    }
}

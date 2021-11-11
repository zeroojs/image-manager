import { Image } from './../image/entities/image.entity';
import { Module } from '@nestjs/common';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Image])
  ],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}

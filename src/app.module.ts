import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';

import { TypeOrmModule } from '@nestjs/typeorm'
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    GroupModule,
    ImageModule,
    TypeOrmModule.forRoot(
      {
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "123456",
        "database": "image-manager",
        // "entities": ["../**/**.entity{.ts,.js}"],
        // 这里有个神坑  记得用__dirname连接
        "entities": [__dirname + '/**/*.entity{.ts,.js}'],
        "synchronize": true
        // "timezone": "local",
        // "charset": "utf8mb4",
        // "multipleStatements": true,
        // "dropSchema": false,
        // "logging": true
      }
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

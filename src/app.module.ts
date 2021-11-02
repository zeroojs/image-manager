import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';

import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    GroupModule,
    TypeOrmModule.forRoot(
      {
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "123456",
        "database": "image-manager",
        // "entities": ["../**/**.entity{.ts,.js}"],
        "entities": [__dirname + '/**/*.entity{.ts,.js}'],
        "synchronize": true
        // "timezone": "local",
        // "charset": "utf8mb4",
        // "multipleStatements": true,
        // "dropSchema": false,
        // "logging": true
      }
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

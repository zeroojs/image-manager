import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Bind } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  // 上传
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(UploadedFiles(), Body())
  // from @types/multer -> Express.Multer.File[]
  async create(files: Express.Multer.File[], createImageDto: CreateImageDto) {
    createImageDto.files = files
    const result = await this.imageService.create(createImageDto);
    return {
      code: result ? 2000 : 3000,
      data: result,
      message: result ? 'ok' : 'fail'
    }
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}

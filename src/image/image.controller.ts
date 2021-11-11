import { QueryImageDto } from './dto/query-image.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Bind, Query, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express'

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
  findAll(@Query() query: QueryImageDto) {
    return this.imageService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete()
  batchRemove(@Body() body: { ids: string[] }) {
    if (body.ids.length === 1) return this.imageService.remove(+body.ids[0])
    return this.imageService.batchRemove(body.ids.map(id => parseInt(id)))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }

  // 下载
  @Post('/download')
  async download(@Body() body: { id: number, size: string }, @Res() res: Response) {
    const data = await this.imageService.download(body.id, body.size)
    console.log('data', data)
    res.
      status(200)
      .send(data)
  }
}

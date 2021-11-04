import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getPixelSize } from 'src/utils';
import { Qiniu } from 'src/utils/qiniu';
import { deleteReturn, queryByListReturn, queryReturn, updateServiceReturn } from 'src/utils/return.format';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './entities/image.entity';

@Injectable()
export class ImageService {
  private qiniu: Qiniu
  private connection: Connection

  constructor(
    @InjectRepository(Image) private image: Repository<Image>
  ) {
    this.qiniu = new Qiniu();
    this.connection = getConnection();
  }
  async create(createImageDto: CreateImageDto) {
    const filesData = [];
    const { files, groupId } = createImageDto;
    // 获取图片信息
    files.forEach(file => {
      const { width, height, type } = getPixelSize(file.buffer)
      filesData.push({
        width,
        height,
        size: file.size,
        mime: file.mimetype,
        ext: type,
        buffer: file.buffer,
        filename: file.originalname
      })
    })

    // 上传图片到七牛云
    const uploadProgress = filesData.map(file => {
      // const dir = format(new Date(), 'YYYYMMDD')
      const uploadKey = `images/${file.filename}`
      return this.qiniu.uploadBuffer(uploadKey, file.buffer)
    })

    // 保存到数据库
    // 多个图片进行事务回滚
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    // 开始
    await queryRunner.startTransaction();
    let delResult = null
    try {
      // 测试域名(可自定义域名)
      const domain = 'r205lrfmz.hn-bkt.clouddn.com';
      const uploads = await Promise.all(uploadProgress);
      const images: Image[] = uploads.map((item, index) => {
        return {
          filename: filesData[index].filename,
          size: filesData[index].size,
          mime: filesData[index].mime,
          ext: filesData[index].ext,
          width: filesData[index].width,
          height: filesData[index].height,
          mini: `http://${domain}/${item.key}/mini`,
          thumb: `http://${domain}/${item.key}/thumb`,
          middle: `http://${domain}/${item.key}/middle`,
          url: `http://${domain}/${item.key}/origin`,
          cloud: item,
          groupId: typeof groupId === 'string' ? parseInt(groupId) : groupId
        }
      }) as Image[]
      // delResult = await Promise.all(saves)
      delResult = await queryRunner.manager.save(Image, images)
    } catch (err) {
      console.log('err', err)
      // 回滚
      await queryRunner.rollbackTransaction();
    } finally {
      // 发布
      await queryRunner.release();
    }
    return delResult
  }

  async findAll() {
    const total = await this.image.count()
    const items = await this.image.find()
    return queryByListReturn<Image[]>(items, total)
  }

  async findOne(id: number) {
    const image = await this.image.findOne({ id })
    return queryReturn<Image>(image)
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    const group = await this.findOne(id)
    if (group.code !== 2000) return updateServiceReturn({ n: 0 })
    const res = await this.image.update(id, updateImageDto)
    return updateServiceReturn(res)
  }

  async remove(id: number) {
    const { code } = await this.findOne(id)
    if (code !== 2000) return deleteReturn({ n: 0 })
    const res = await this.image.delete(id)
    return deleteReturn(res)
  }
}

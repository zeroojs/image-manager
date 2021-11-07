import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { getPixelSize } from 'src/utils';
import { Qiniu } from 'src/utils/qiniu';
import { deleteReturn, queryByListReturn, queryReturn, updateServiceReturn } from 'src/utils/return.format';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { QueryImageDto } from './dto/query-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './entities/image.entity';

@Injectable()
export class ImageService {
  private qiniu: Qiniu
  private connection: Connection

  constructor(
    @InjectRepository(Image) private image: Repository<Image>,
    @InjectRepository(Group) private group: Repository<Group>
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
    let dealResult = null
    try {
      // 测试域名(可自定义域名)
      const domain = 'r205lrfmz.hn-bkt.clouddn.com';
      const uploads = await Promise.all(uploadProgress);
      console.log('上传图片')
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
          // group
          groupId: typeof groupId === 'string' ? parseInt(groupId) : groupId
        }
      }) as Image[]
      // delResult = await Promise.all(saves)
      dealResult = await queryRunner.manager.save(Image, images)
      console.log('将oos结果整合录入数据库')
      // 更新分组图片计数
      const group = await queryRunner.manager.findOne(Group, { id: groupId }, { relations: ['images'] })
      await queryRunner.manager.update(Group, group.id, { count: group.images.length || 0 })
      console.log('更新分组图片计数')
    } catch (err) {
      console.log('err', err)
      // 回滚
      await queryRunner.rollbackTransaction();
    } finally {
      // 发布
      await queryRunner.release();
    }
    console.log('返回结果')
    return dealResult
  }

  async findAll(query: QueryImageDto) {
    const filter = {
      skip: query.offset || 0,
      take: query.limit || 10,
      where: ''
    }
    if (query.groupId) {
      filter.where = `image.groupId = ${query.groupId}`
    }
    const total = await this.image.count({ where: filter.where })
    // const items = await this.image.find(filter)
    const items = await this.image
      .find({
        relations: ['group'],
        ...filter
      })
    return queryByListReturn<Image[]>(items, total)
  }

  async findOne(id: number) {
    const image = await this.image.findOne({ id })
    return queryReturn<Image>(image)
  }

  // 只允许更改分组以及文件名称
  async update(id: number, updateImageDto: UpdateImageDto) {
    const { code } = await this.findOne(id)
    if (code !== 2000) return updateServiceReturn({ n: 0 })
    const res = await this.image.update(id, updateImageDto)
    return updateServiceReturn(res)
  }

  async remove(id: number) {
    const { code, data } = await this.findOne(id)
    if (code !== 2000) return deleteReturn({ n: 0 })
    // 删除七牛云资源
    await this.qiniu.dropFile(data.cloud.key);
    // 删除数据库记录
    const res = await this.image.delete(id)
    return deleteReturn(res)
  }
}

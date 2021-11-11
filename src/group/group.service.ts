import { Image } from './../image/entities/image.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, getConnection, } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity'
import { queryByListReturn, queryReturn, updateServiceReturn, deleteReturn, createReturn } from '../utils/return.format'
import { QueryGroupDto } from './dto/query-group.dto';
import { Qiniu } from 'src/utils/qiniu';
@Injectable()
export class GroupService {
  private qiniu: Qiniu
  private connection: Connection
  constructor(@InjectRepository(Group) private group: Repository<Group>) {
    this.qiniu = new Qiniu();
    this.connection = getConnection();
  }
  
  async create(createGroupDto: CreateGroupDto) {
    // 查重
    const group = await this.group.findOne({ name: createGroupDto.name })
    if (group) return createReturn('组名已存在')
    const newGroup = await this.group.save(createGroupDto)
    return createReturn<Group>(newGroup)
  }

  async findAll(query: QueryGroupDto) {
    const filter = {
      skip: query.offset || 0,
      take: query.limit || 10
    }
    const total = await this.group.count()
    const items = await this.group
      // .find({
      //   // relations: ['images'],
      //   ...filter
      // })
      .createQueryBuilder('group')
      .leftJoin('group.images', 'images')
      .select(['group'])
      .addSelect(['images.thumb', 'images.middle'])
      .offset(filter.skip)
      .limit(filter.take)
      .orderBy('group.id', 'DESC')
      .getMany()
    return queryByListReturn<Group[]>(items, total)
  }

  async findOne(id: number) {
    // return this.group.findOne({ id })
    const group = await this.group.findOne({ id })
    return queryReturn<Group>(group)
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.findOne(id)
    if (group.code !== 2000) return updateServiceReturn({ n: 0 })
    const res = await this.group.update(id, updateGroupDto)
    return updateServiceReturn(res)
  }

  async remove(id: number) {
    const group = await this.group.findOne({ id }, {
      relations: ['images']
    })
    if (!group) return deleteReturn({ n: 0 })
    // 删除分组中的图片
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    // 开始
    await queryRunner.startTransaction();
    let dealResult = null
    console.log('data.images', group.images)
    try {
      if (group.images && group.images.length) {
        const delActions = group.images.map(async image => {
          console.log('image.id', image)
          // 删除七牛云资源
          if (image.cloud) {
            const res = await this.qiniu.dropFile(image.cloud.key)
            console.log('七牛云资源已删除', res)
          }
          return queryRunner.manager.delete(Image, image.id)
        })
        // 删除分组中的图片
        await Promise.all(delActions)
        console.log('分组中的图片已删除')
      }
      // 删除分组
      dealResult = await queryRunner.manager.delete(Group, id)
      // dealResult = await this.group.delete(id)
      console.log('dealResult', dealResult)
      console.log('分组已删除')
    } catch (err) {
      console.log('err', err)
      // 回滚
      await queryRunner.rollbackTransaction();
    } finally {
      // 发布
      await queryRunner.release();
    }
    console.log('dealResult', dealResult)
    console.log('返回结果')
    return deleteReturn(dealResult)
  }
}

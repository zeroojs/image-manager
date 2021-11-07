import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity'
import { queryByListReturn, queryReturn, updateServiceReturn, deleteReturn, createReturn } from '../utils/return.format'
import { QueryGroupDto } from './dto/query-group.dto';

@Injectable()
export class GroupService {
  constructor(@InjectRepository(Group) private group: Repository<Group>) {}
  
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
    const { code } = await this.findOne(id)
    if (code !== 2000) return deleteReturn({ n: 0 })
    const res = await this.group.delete(id)
    return deleteReturn(res)
  }
}

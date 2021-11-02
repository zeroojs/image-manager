import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity'

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private group: Repository<Group>
  ) {}
  create(createGroupDto: CreateGroupDto) {
    // return 'This action adds a new group';
    return this.group.save(createGroupDto)
  }

  findAll() {
    // return `This action returns all group`;
    return this.group.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}

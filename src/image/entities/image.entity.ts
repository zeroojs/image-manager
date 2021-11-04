import { Group } from 'src/group/entities/group.entity';
import { Entity, PrimaryGeneratedColumn, Column, Timestamp, UpdateDateColumn, CreateDateColumn, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn({ comment: '主键id', type: 'int' })
  id: number;

  @Column({ nullable: false, unique: true })
  filename: string // 文件名称

  @Column({ nullable: true })
  size: number // 文件大小 （字节）

  @Column({ nullable: true })
  mime: string // 文件 mime 类型

  @Column()
  ext: string // 文件扩展名

  @Column()
  width: number // 图片宽度 px

  @Column()
  height: number // 图片高度 px
  
  @Column()
  mini: string // 64x64 | 50% 小图标

  @Column()
  thumb: string // 100x100 | 50% 缩略图

  @Column()
  middle: string // auto | 75% 中等
  
  @Column({ nullable: true })
  url: string // auto | 100% 原图

  @Column({ nullable: false, type: 'json' })
  cloud: object // 七牛云文件信息

  @ManyToOne(type => Group, group => group.images)
  group: Group

  @RelationId((image: Image) => image.group)
  groupId: number

  @CreateDateColumn({
    type: 'timestamp'
  })
  createAt: Timestamp;

  @UpdateDateColumn({
    type: 'timestamp'
  })
  updateAt: Timestamp;
}

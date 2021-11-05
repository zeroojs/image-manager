import { Image } from 'src/image/entities/image.entity';
import { Entity, PrimaryGeneratedColumn, Column, Timestamp, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm';
// import { customAlphabet } from 'nanoid'
// const nanoid = customAlphabet('1234567890abcdef', 10)

@Entity()
export class Group {
  @PrimaryGeneratedColumn({ comment: '主键id', type: 'int' })
  id: number;

  // 用于前端 id 操作 待解决
  // @Column({
  //   // primary: true,
  //   type: 'varchar',
  //   // default: () => nanoid()
  //   default: () => 'abc'
  // })
  // // nanoid: string;
  // nano: string;

  @Column({ type: 'varchar', unique: true, comment: '分组名称，不可重复' })
  name: string;

  // 包含图片数量(缓存)
  @Column({ type: 'int', default: 0, comment: '包含图片数量' })
  count: number;

  // 包含图片
  @OneToMany(type => Image, image => image.group)
  images: Image[];

  @CreateDateColumn({
    type: 'timestamp'
  })
  createAt: Timestamp;

  @UpdateDateColumn({
    type: 'timestamp'
  })
  updateAt: Timestamp;
}
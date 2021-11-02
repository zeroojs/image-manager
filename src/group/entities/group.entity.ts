import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)

@Entity()
export class Group {
  @PrimaryGeneratedColumn({ comment: '主键id', type: 'int' })
  id: number;

  // 用于前端 id 操作 待解决
  // @Column({
  //   // primary: true,
  //   type: 'varchar',
  //   default: () => nanoid()
  // })
  // nanoid: string;

  // 分组名称
  @Column({ type: 'varchar' })
  name: string;

  // 包含图片数量
  @Column({ type: 'int', default: 0 })
  count: number;

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  createAt: Timestamp;

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp',
  })
  updateAt: Timestamp;
}
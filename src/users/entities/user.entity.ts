import { FileEntity } from 'src/files/entities/file.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 80 })
  email: string;

  @Column({ length: 200 })
  password: string;

  @Column({ nullable: true, length: 50 })
  fullName: string | null;

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];
}

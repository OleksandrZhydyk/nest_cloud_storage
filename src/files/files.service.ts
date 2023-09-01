import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
  ) {}

  async create(user: UserEntity, file: Express.Multer.File) {
    const fileEntity = this.repository.create({
      fileName: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      originalName: file.originalname,
      path: file.path,
    });

    fileEntity.user = user;
    const fileDb = await this.repository.save(fileEntity);
    delete fileDb.user.password;
    return fileDb;
  }

  async findAll(user: UserEntity) {
    return await this.repository.find({
      where: {
        user: { id: user.id },
      },
    });
  }

  async findByIdAndUser(id: number, user: UserEntity) {
    const fileDb = await this.repository.findOne({
      where: {
        id: id,
        user: { id: user.id },
      },
      relations: {
        user: true,
      },
    });
    delete fileDb.user.password;
    return fileDb;
  }

  async findOneById(id: number) {
    return await this.repository.findOne({
      where: { id: id },
      relations: {
        user: true,
      },
    });
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  async remove(id: number) {
    return await this.repository.delete({ id: id });
  }
}

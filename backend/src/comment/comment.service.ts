import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createCommentDto } from './dto/create-comment.dto';
import { updateCommentDto } from './dto/update-comment.dto';
import { Comment } from 'src/entities/comment.entity';
import { File } from 'src/entities/file.entity';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(File) private fileRepository: Repository<File>
        ) {}

    findAll(): Promise<Comment[]> {
        return this.commentRepository.find()
    }
    
    async findOne(userCommentId: number): Promise<Comment> {
        const commentFound = await this.commentRepository.findOne({
            where: {
                userCommentId,
            },
            relations: ['meeting'],
            order: {
                datetime: 'DESC'
            }
        })
        if (!commentFound) {
            throw new HttpException('Comentario no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return commentFound
    }
    
    async findOneMeeting(meetingUserId: number, meetingStartDatetime: Date): Promise<Comment[]> {
        return this.commentRepository.find({
            where: {
                meetingUserId,
                meetingStartDatetime
            },
            relations: ['meeting', 'user', 'files']
        })
    }

    async create(comment: createCommentDto): Promise<Comment | HttpException> {
        return this.commentRepository.save(comment)
    }

    async update(meetingUserId: number, datetime: Date, comment: updateCommentDto) {
        const commentFound = await this.commentRepository.findOne({
            where: {
                meetingUserId,
                datetime
            }
        })
        if (!commentFound) {
            throw new HttpException('Comentario no encontrado', HttpStatus.NOT_FOUND)
        }
        
        const updateComment = Object.assign(commentFound, comment)
        return this.commentRepository.save(updateComment)
    }
    
    async delete(meetingUserId: number, datetime: Date) {
        const result = await this.commentRepository.delete({meetingUserId, datetime})
    
        if (result.affected == 0) {
            throw new HttpException('Comentario no encontrado', HttpStatus.NOT_FOUND)
        }

        return result
    }

    async uploadFile(commentMeetingUserId: number, commentDatetime: Date, body: any ) {
        const { url, name, type } = body
        const file = {
            url,
            name,
            type,
            commentMeetingUserId,
            commentDatetime
        }

        return this.fileRepository.save(file)
    }
}

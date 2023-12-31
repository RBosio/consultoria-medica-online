import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createCommentDto } from './dto/create-comment.dto';
import { updateCommentDto } from './dto/update-comment.dto';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>
        ) {}

    findAll(): Promise<Comment[]> {
        return this.commentRepository.find()
    }
    
    async findOne(meetingUserId: number, datetime: Date): Promise<Comment> {
        const commentFound = await this.commentRepository.findOne({
            where: {
                meetingUserId,
                datetime
            },
            relations: ['meeting']
        })
        if (!commentFound) {
            throw new HttpException('Comentario no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return commentFound
    }
    
    async findOneMeeting(meetingUserId: number, meetingStartDatetime: Date): Promise<Comment> {
        const commentFound = await this.commentRepository.findOne({
            where: {
                meetingUserId,
                meetingStartDatetime
            },
            relations: ['meeting']
        })
        if (!commentFound) {
            throw new HttpException('Comentario no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return commentFound
    }

    async create(comment: createCommentDto): Promise<Comment | HttpException> {
        let newComment = this.commentRepository.create(comment)

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
}

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
    
    async findOne(id: number): Promise<Comment> {
        const commentFound = await this.commentRepository.findOne({
            where: {
                id
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
        const comments = await this.commentRepository.find({
            where: {
                meetingUserId,
                meetingStartDatetime
            },
            relations: ['meeting', 'user', 'files']
        })

        comments.map(comment => {
            delete comment.user.password
            return comment
        })

        return comments
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
        const { url, name, type, commentId } = body

        const f = {
            url,
            name,
            type,
            commentMeetingUserId,
            commentDatetime
        }
        const file = this.fileRepository.create(f)
        file.comment = await this.findOne(commentId)

        return this.fileRepository.save(file)
    }
}

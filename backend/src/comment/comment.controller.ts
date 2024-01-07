import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, UseGuards, ParseIntPipe } from '@nestjs/common';
import { createCommentDto } from './dto/create-comment.dto';
import { updateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { Comment } from 'src/entities/comment.entity';

@Controller('comment')
export class CommentController {

    constructor(private commentService: CommentService) {}
    
    @Get()
    getComments(): Promise<Comment[]> {
        return this.commentService.findAll()
    }
    
    @Get(':userId/:datetime')
    getComment(@Param('userId') userId: number, @Param('datetime') datetime: Date): Promise<Comment | HttpException> {
        return this.commentService.findOne(userId, datetime)
    }
    
    @Get('meeting/:userId/:meetingStartDatetime')
    getCommentsMeeting(@Param('userId') userId: number, @Param('meetingStartDatetime') meetingStartDatetime: Date): Promise<Comment[] | HttpException> {
        return this.commentService.findOneMeeting(userId, meetingStartDatetime)
    }

    @Post()
    createComment(@Body() comment: createCommentDto): Promise<Comment | HttpException> {
        return this.commentService.create(comment)
    }

    @Patch(':userId/:datetime')
    updateComment(@Param('userId') userId: number, @Param('datetime') datetime: Date, @Body() comment: updateCommentDto) {
        return this.commentService.update(userId, datetime, comment)
    }

    @Delete(':userId/:datetime')
    deleteComment(@Param('userId') userId: number, @Param('datetime') datetime: Date) {
        return this.commentService.delete(userId, datetime)
    }
}

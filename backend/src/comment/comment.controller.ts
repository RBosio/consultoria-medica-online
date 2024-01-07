import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, UseGuards, ParseIntPipe } from '@nestjs/common';
import { createCommentDto } from './dto/create-comment.dto';
import { updateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { Comment } from 'src/entities/comment.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';

@Controller('comment')
@UseGuards(AuthGuard, RolesGuard)
export class CommentController {

    constructor(private commentService: CommentService) {}
    
    @Get()
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getComments(): Promise<Comment[]> {
        return this.commentService.findAll()
    }
    
    @Get(':userId/:datetime')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getComment(@Param('userId') userId: number, @Param('datetime') datetime: Date): Promise<Comment | HttpException> {
        return this.commentService.findOne(userId, datetime)
    }
    
    @Get('meeting/:userId/:meetingStartDatetime')
    getCommentsMeeting(@Param('userId') userId: number, @Param('meetingStartDatetime') meetingStartDatetime: Date): Promise<Comment[] | HttpException> {
        return this.commentService.findOneMeeting(userId, meetingStartDatetime)
    }

    @Post()
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    createComment(@Body() comment: createCommentDto): Promise<Comment | HttpException> {
        return this.commentService.create(comment)
    }

    @Patch(':userId/:datetime')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    updateComment(@Param('userId') userId: number, @Param('datetime') datetime: Date, @Body() comment: updateCommentDto) {
        return this.commentService.update(userId, datetime, comment)
    }

    @Delete(':userId/:datetime')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    deleteComment(@Param('userId') userId: number, @Param('datetime') datetime: Date) {
        return this.commentService.delete(userId, datetime)
    }
}

import { Auth } from "../../../shared/types"
import { FileResponseDto } from "./file.dto"
import { UserResponseDto } from "./user.dto"

export interface CommentResponseDto {
    datetime: Date
    comment: string
    files: FileResponseDto
    user: UserResponseDto
    auth: Auth
}
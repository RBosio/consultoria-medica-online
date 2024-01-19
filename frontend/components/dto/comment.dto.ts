import { Auth } from "../../../shared/types"
import { UserResponseDto } from "./user.dto"

export interface CommentResponseDto {
    datetime: Date
    comment: string
    user: UserResponseDto
    auth: Auth
}
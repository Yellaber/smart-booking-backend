import { SetupResponseDto } from '../dto/setup-response.dto';

export class SetupResponse {
    static get(message: string, success: boolean): SetupResponseDto {
        return { message, success };
    }
}
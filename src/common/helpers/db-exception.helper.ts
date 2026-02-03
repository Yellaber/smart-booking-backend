import { BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';

export class DbException {
    private logger: Logger;

    constructor(context: string) {
        this.logger = new Logger(context);
    }
    
    handle(error: any): never {
        switch (error.code) {
            case '23505':
                throw new BadRequestException('Duplicate value');
            case '23502':
                throw new BadRequestException('Missing required field');
            default:
                this.logger.error(error);
                throw new InternalServerErrorException('Unexpected error, check server logs');
        }
    }
}
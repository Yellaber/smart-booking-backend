import { BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';

export class DbException {
    private logger: Logger;

    constructor(context: string) {
        this.logger = new Logger(context);
    }
    
    handle(error: any) {
        const errorCodes = ['23502', '23505'];

        if(errorCodes.includes(error.code))
            throw new BadRequestException(error.detail);
        
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs')
    }
}
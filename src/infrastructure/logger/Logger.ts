import winston from 'winston';
import { injectable } from 'tsyringe';
import { ILogger } from '../../common/interfaces';

@injectable()
export class LoggerService implements ILogger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        });
    }

    info(message: string, context?: any): void {
        this.logger.info(message, { context });
    }

    error(message: string, trace?: string, context?: any): void {
        this.logger.error(message, { trace, context });
    }

    warn(message: string, context?: any): void {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: any): void {
        this.logger.debug(message, { context });
    }
}

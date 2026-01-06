import { container } from 'tsyringe';
import { LoggerService } from '../services/LoggerService';
import { CloudStorageService } from '../services/CloudStorageService';
import { EmailService } from '../services/EmailService';
import { JwtService } from '../services/JwtService';
import { HashService } from '../services/HashService';
import { MongoUserRepository } from '../database/repositories/MongoUserRepository';
import { MongoDriverRepository } from '../database/repositories/MongoDriverRepository';

// Register Infrastructure Services
container.register('ILoggerService', { useClass: LoggerService });
container.register('IStorageService', { useClass: CloudStorageService });
container.register('IEmailService', { useClass: EmailService });
container.register('IJwtService', { useClass: JwtService });
container.register('IHashService', { useClass: HashService });

// Register Repositories
container.register('IUserRepository', { useClass: MongoUserRepository });
container.register('IDriverRepository', { useClass: MongoDriverRepository });

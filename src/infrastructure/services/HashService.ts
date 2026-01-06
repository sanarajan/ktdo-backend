import { injectable } from 'tsyringe';
import bcrypt from 'bcrypt';
import { IHashService } from '../../application/services';

@injectable()
export class HashService implements IHashService {
    async hash(value: string, saltRounds = 10): Promise<string> {
        return bcrypt.hash(value, saltRounds);
    }

    async compare(value: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(value, hashed);
    }
}

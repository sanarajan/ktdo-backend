export interface IHashService {
    hash(value: string, saltRounds?: number): Promise<string>;
    compare(value: string, hashed: string): Promise<boolean>;
}

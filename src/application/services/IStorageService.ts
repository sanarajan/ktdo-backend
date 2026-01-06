export interface IStorageService {
    uploadFile(file: any, path: string): Promise<string>;
    uploadBuffer(buffer: Buffer, mimeType: string, folder: string): Promise<string>;
    deleteFile(path: string): Promise<void>;
}

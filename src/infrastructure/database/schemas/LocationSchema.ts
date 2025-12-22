import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
    state: string;
    districts: string[];
}

const LocationSchema: Schema = new Schema({
    state: { type: String, required: true, unique: true },
    districts: [{ type: String, required: true }]
}, { timestamps: true });

export default mongoose.model<ILocation>('Location', LocationSchema);

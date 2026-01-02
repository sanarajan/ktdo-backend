import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
    state: string;
    districts: string[];
    stateCode?: string;
}

const LocationSchema: Schema = new Schema({
    state: { type: String, required: true, unique: true },
    stateCode: { type: String, required: false },
    districts: [{ type: String, required: true }]
}, { timestamps: true });

export default mongoose.model<ILocation>('Location', LocationSchema);

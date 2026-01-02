import { injectable } from 'tsyringe';
import Location from '../../infrastructure/database/schemas/LocationSchema';

@injectable()
export class GetLocationsUseCase {
    async getStates(): Promise<string[]> {
        const locations = await Location.find({}, { state: 1, _id: 0 }).sort({ state: 1 });
        return locations.map((loc: any) => loc.state);
    }

    async getDistricts(state: string): Promise<string[]> {
        const location = await Location.findOne({ state });
        return location ? location.districts.sort() : [];
    }

    async getStateCodes(): Promise<{ state: string; code: string }[]> {
        // Read state codes from Location documents (field: stateCode)
        const locations = await Location.find({}, { state: 1, stateCode: 1, _id: 0 }).sort({ state: 1 });
        return locations.map((loc: any) => ({ state: loc.state, code: loc.stateCode || '' }));
    }
}

export interface IGetLocationsUseCase {
    getStates(): Promise<string[]>;
    getDistricts(state: string): Promise<string[]>;
    getStateCodes(): Promise<{ state: string; code: string }[]>;
}

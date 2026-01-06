import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IGetLocationsUseCase } from '../../application/usecases/interface/location/IGetLocationsUseCase';
import { StatusCode, SuccessMessage } from '../../common/constants';

@injectable()
export class LocationController {
    constructor(
        @inject('IGetLocationsUseCase') private getLocationsUseCase: IGetLocationsUseCase
    ) { }

    async getStates(req: Request, res: Response, next: NextFunction) {
        try {
            const states = await this.getLocationsUseCase.getStates();
            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.STATES_RETRIEVED,
                data: states
            });
        } catch (error) {
            next(error);
        }
    }

    async getDistricts(req: Request, res: Response, next: NextFunction) {
        try {
            const { state } = req.params;
            const districts = await this.getLocationsUseCase.getDistricts(state);
            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.DISTRICTS_RETRIEVED,
                data: districts
            });
        } catch (error) {
            next(error);
        }
    }

    async getStateCodes(req: Request, res: Response, next: NextFunction) {
        try {
            const codes = await this.getLocationsUseCase.getStateCodes();
            res.status(StatusCode.OK).json({ success: true, message: SuccessMessage.STATE_CODES_RETRIEVED, data: codes });
        } catch (error) {
            next(error);
        }
    }
}

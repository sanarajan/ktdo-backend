import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { GetLocationsUseCase } from '../../usecases/location/GetLocationsUseCase';
import { HttpCode } from '../../common/enums';
import { SuccessMessage } from '../../common/constants';

@injectable()
export class LocationController {
    constructor(
        @inject(GetLocationsUseCase) private getLocationsUseCase: GetLocationsUseCase
    ) { }

    async getStates(req: Request, res: Response, next: NextFunction) {
        try {
            const states = await this.getLocationsUseCase.getStates();
            res.status(200).json({
                success: true,
                message: 'States retrieved successfully',
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
            res.status(200).json({
                success: true,
                message: 'Districts retrieved successfully',
                data: districts
            });
        } catch (error) {
            next(error);
        }
    }

    async getStateCodes(req: Request, res: Response, next: NextFunction) {
        try {
            const codes = await this.getLocationsUseCase.getStateCodes();
            res.status(200).json({ success: true, message: 'State codes retrieved', data: codes });
        } catch (error) {
            next(error);
        }
    }
}

import 'reflect-metadata';
import { container } from 'tsyringe';

// Import all container registrations
import './infrastructureContainer';
import './usecaseContainer';
import './controllerContainer';

export { container };

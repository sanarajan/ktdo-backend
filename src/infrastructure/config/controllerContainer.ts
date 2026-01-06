import { container } from 'tsyringe';
import { AuthController } from '../../adapters/controllers/AuthController';
import { AdminController } from '../../adapters/controllers/AdminController';
import { LocationController } from '../../adapters/controllers/LocationController';

// Register Controllers
container.register(AuthController, { useClass: AuthController });
container.register(AdminController, { useClass: AdminController });
container.register(LocationController, { useClass: LocationController });

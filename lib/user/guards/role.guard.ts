import { Middleware } from '../../helpers';
import {
	NextApiRequestWAuth,
	NextApiResponseWCustom,
} from '../../helpers/endpoint.helper';

export const RoleGuard = (roles: string[]) =>
	class extends Middleware {
		handle(req: NextApiRequestWAuth, res: NextApiResponseWCustom) {
			const result = !!req.user?.userRoles?.some(
				({ role }) =>
					(role.name && roles.includes(role.name)) || role.name === 'Superadmin'
			);

			if (!result) res.unauthorize();

			return result;
		}
	};

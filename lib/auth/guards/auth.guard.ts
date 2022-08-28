import { Middleware } from '../../helpers';
import {
	NextApiRequestWAuth,
	NextApiResponseWCustom,
} from '../../helpers/endpoint.helper';
import { role, user, user_role } from '@prisma/client';

export type auth = user & { userRoles?: user_role & { role: role }[] };

export class AuthGuard extends Middleware {
	handle(req: NextApiRequestWAuth, res: NextApiResponseWCustom) {
		if (req.user) return true;
		res.unauthorize();
		return false;
	}
}

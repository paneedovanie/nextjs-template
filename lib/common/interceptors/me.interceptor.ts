import { NextApiResponse } from 'next';
import { Middleware } from '../../helpers';
import { NextApiRequestWAuth } from '../../helpers/endpoint.helper';

export class MeInterceptor extends Middleware {
	handle(
		req: NextApiRequestWAuth,
		res: NextApiResponse<any>
	): boolean | void | Promise<boolean | void> {
		if (req?.user && req.query.id === 'me') {
			req.query.id = req.user.id;
		}
	}
}

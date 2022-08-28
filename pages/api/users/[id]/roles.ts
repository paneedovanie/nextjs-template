// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import {
	Endpoints,
	Response,
	QueryValidation,
	BodyValidation,
} from '../../../../lib/helpers';
import { RoleGuard } from '../../../../lib/user/guards/role.guard';
import { AuthGuard } from '../../../../lib/user/guards/auth.guard';
import { MeInterceptor } from '../../../../lib/common/interceptors/me.interceptor';
import { UserRepository } from '../../../../lib/user/repositories/user.repository';
import { UpdateRoleSchema } from '../../../../lib/user/schemas/user.schema';

const idQuerySchema = yup.object().shape({
	id: yup.string().uuid().required(),
});

const userRepository = new UserRepository();

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
	const result = await userRepository.updateRole(
		req.query.id as string,
		req.body
	);
	Response.setData(result).go(res);
};

export default Endpoints.post(handlePost, [
	AuthGuard,
	RoleGuard(['Admin']),
	MeInterceptor,
	QueryValidation(idQuerySchema),
	BodyValidation(UpdateRoleSchema),
]).go();

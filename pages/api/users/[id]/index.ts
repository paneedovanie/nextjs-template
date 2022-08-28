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
import { AuthGuard } from '../../../../lib/auth/guards/auth.guard';
import { MeInterceptor } from '../../../../lib/common/interceptors/me.interceptor';
import { UserRepository } from '../../../../lib/user/repositories/user.repository';
import { UpdateUserSchema } from '../../../../lib/user/schemas/user.schema';

const idQuerySchema = yup.object().shape({
	id: yup.string().uuid().required(),
});

const userRepository = new UserRepository();

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
	const result = await userRepository.getOneById(req.query.id as string);
	Response.setData(result).go(res);
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
	await userRepository.deleteOneById(req.query.id as string);

	Response.setData({
		deleted: true,
	}).go(res);
};

const handleUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
	const result = await userRepository.update(req.query.id as string, req.body);
	Response.setData(result).go(res);
};

export default Endpoints.get(handleGet, [
	AuthGuard,
	RoleGuard(['Admin']),
	MeInterceptor,
	QueryValidation(idQuerySchema),
])
	.put(handleUpdate, [
		AuthGuard,
		RoleGuard(['Admin']),
		MeInterceptor,
		QueryValidation(idQuerySchema),
		BodyValidation(UpdateUserSchema),
	])
	.patch(handleUpdate, [
		AuthGuard,
		RoleGuard(['Admin']),
		MeInterceptor,
		QueryValidation(idQuerySchema),
		BodyValidation(UpdateUserSchema),
	])
	.delete(handleDelete, [AuthGuard, RoleGuard(['Admin'])])
	.go();

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
import { CategoryRepository } from '../../../../lib/category/repositories/category.repository';
import { UpdateCategorySchema } from '../../../../lib/category/schemas/category.schema';

const idQuerySchema = yup.object().shape({
	id: yup.string().uuid().required(),
});

const categoryRepository = new CategoryRepository();

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
	const result = await categoryRepository.getOneById(req.query.id as string);
	res.json(result);
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
	await categoryRepository.deleteOneById(req.query.id as string);

	Response.setData({
		deleted: true,
	}).go(res);
};

const handleUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
	const result = await categoryRepository.update(
		req.query.id as string,
		req.body
	);

	res.json(result);
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
		BodyValidation(UpdateCategorySchema),
	])
	.patch(handleUpdate, [
		AuthGuard,
		RoleGuard(['Admin']),
		MeInterceptor,
		QueryValidation(idQuerySchema),
		BodyValidation(UpdateCategorySchema),
	])
	.delete(handleDelete, [AuthGuard, RoleGuard(['Admin'])])
	.go();

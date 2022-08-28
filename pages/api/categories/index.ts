// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
	Response,
	CreatedResponse,
	BadRequestResponse,
	checkPrismaError,
	Endpoints,
	BodyValidation,
} from '../../../lib/helpers';
import { RoleGuard } from '../../../lib/user/guards/role.guard';
import { CategoryRepository } from '../../../lib/category/repositories/category.repository';
import { AuthGuard } from '../../../lib/auth/guards/auth.guard';
import { CreateCategorySchema } from '../../../lib/category/schemas/category.schema';

const categoryRepository = new CategoryRepository();

const handleGet = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	const { page = 1, limit = 10 } = req.query;

	const options = {
		page: +page,
		limit: +limit,
	};
	const result = await categoryRepository.getPaginated(options);

	Response.setData(result).go(res);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	try {
		const category = await categoryRepository.create(req.body);

		CreatedResponse.setData(category).go(res);
	} catch (error: any) {
		const errors = checkPrismaError(error);
		if (errors) BadRequestResponse.setData(errors).go(res);
		else BadRequestResponse.setMessage(error.message).go(res);
	}
};

export default Endpoints.get(handleGet, [AuthGuard, RoleGuard(['Admin'])])
	.post(handlePost, [
		AuthGuard,
		RoleGuard(['Admin']),
		BodyValidation(CreateCategorySchema),
	])
	.go();

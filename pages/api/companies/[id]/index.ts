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
import { CompanyRepository } from '../../../../lib/company/repositories/company.repository';
import { UpdateCompanySchema } from '../../../../lib/company/schemas/company.schema';

const idQuerySchema = yup.object().shape({
	id: yup.string().uuid().required(),
});

const companyRepository = new CompanyRepository();

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
	const result = await companyRepository.getOneById(req.query.id as string);

	res.json(result);
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
	await companyRepository.deleteOneById(req.query.id as string);

	res.json({
		deleted: true,
	});
};

const handleUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
	const result = await companyRepository.update(
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
		BodyValidation(UpdateCompanySchema),
	])
	.patch(handleUpdate, [
		AuthGuard,
		RoleGuard(['Admin']),
		MeInterceptor,
		QueryValidation(idQuerySchema),
		BodyValidation(UpdateCompanySchema),
	])
	.delete(handleDelete, [AuthGuard, RoleGuard(['Admin'])])
	.go();

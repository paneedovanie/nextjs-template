// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import {
	Endpoints,
	QueryValidation,
	BodyValidation,
} from '../../../../lib/helpers';
import { RoleGuard } from '../../../../lib/user/guards/role.guard';
import { AuthGuard } from '../../../../lib/auth/guards/auth.guard';
import { MeInterceptor } from '../../../../lib/common/interceptors/me.interceptor';
import { InvestmentRepository } from '../../../../lib/investment/repositories/investment.repository';
import { UpdateInvestmentSchema } from '../../../../lib/investment/schemas/investment.schema';

const idQuerySchema = yup.object().shape({
	id: yup.string().uuid().required(),
});

const investmentRepository = new InvestmentRepository();

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
	const result = await investmentRepository.getOneById(req.query.id as string);

	res.json(result);
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
	await investmentRepository.deleteOneById(req.query.id as string);

	res.json({
		deleted: true,
	});
};

const handleUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
	const result = await investmentRepository.update(
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
		BodyValidation(UpdateInvestmentSchema),
	])
	.patch(handleUpdate, [
		AuthGuard,
		RoleGuard(['Admin']),
		MeInterceptor,
		QueryValidation(idQuerySchema),
		BodyValidation(UpdateInvestmentSchema),
	])
	.delete(handleDelete, [AuthGuard, RoleGuard(['Admin'])])
	.go();

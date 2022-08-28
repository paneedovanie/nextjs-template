// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
	Endpoints,
	BodyValidation,
	NextApiRequestWAuth,
	NextApiResponseWCustom,
} from '../../../lib/helpers';
import { RoleGuard } from '../../../lib/user/guards/role.guard';
import { InvestmentRepository } from '../../../lib/investment/repositories/investment.repository';
import { AuthGuard } from '../../../lib/auth/guards/auth.guard';
import { CreateInvestmentSchema } from '../../../lib/investment/schemas/investment.schema';
import { ProjectRepository } from '../../../lib/project/repositories/project.repository';
import { ProjectStatus } from '../../../lib/project/interfaces/project.interface';

const investmentRepository = new InvestmentRepository();
const projectRepository = new ProjectRepository();

const handleGet = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	const { page = 1, limit = 10 } = req.query;

	const options = {
		page: +page,
		limit: +limit,
	};
	const result = await investmentRepository.getPaginated(options);

	res.json(result);
};

const handlePost = async (
	req: NextApiRequestWAuth,
	res: NextApiResponseWCustom
) => {
	const data = {
		...req.body,
		userId: req.user?.id,
	};

	const project = await projectRepository.getOneById(req.body.projectId);
	if (!project) return res.notFound();

	if (project.status !== ProjectStatus.Pending)
		return res.badRequest({
			message: 'Unable to invest',
		});

	if ((project.budget || 0) < req.body.amount + project.investments._sum.amount)
		return res.badRequest({
			data: {
				amount: 'amount exceed the needed funds',
			},
		});

	const investment = await investmentRepository.create(data);

	res.json(investment);
};

export default Endpoints.get(handleGet, [AuthGuard, RoleGuard(['Admin'])])
	.post(handlePost, [AuthGuard, BodyValidation(CreateInvestmentSchema)])
	.go();

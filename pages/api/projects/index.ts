// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
	Endpoints,
	BodyValidation,
	NextApiResponseWCustom,
	NextApiRequestWAuth,
} from '../../../lib/helpers';
import { RoleGuard } from '../../../lib/user/guards/role.guard';
import { ProjectRepository } from '../../../lib/project/repositories/project.repository';
import { AuthGuard } from '../../../lib/auth/guards/auth.guard';
import { CreateProjectSchema } from '../../../lib/project/schemas/project.schema';
import { ProjectStatus } from '../../../lib/project/interfaces/project.interface';

const projectRepository = new ProjectRepository();

const handleGet = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	const { page = 1, limit = 10 } = req.query;

	const options = {
		page: +page,
		limit: +limit,
	};
	const result = await projectRepository.getPaginated(options);

	res.json(result);
};

const handlePost = async (
	req: NextApiRequestWAuth,
	res: NextApiResponseWCustom
) => {
	const data = {
		...req.body,
		status: ProjectStatus.Pending,
		userId: req.user?.id,
	};
	const project = await projectRepository.create(data);

	res.json(project);
};

export default Endpoints.get(handleGet, [AuthGuard, RoleGuard(['Admin'])])
	.post(handlePost, [
		AuthGuard,
		RoleGuard(['Admin']),
		BodyValidation(CreateProjectSchema),
	])
	.go();

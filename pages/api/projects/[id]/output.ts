// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
	Endpoints,
	BodyValidation,
	NextApiResponseWCustom,
	QueryValidation,
} from '../../../../lib/helpers';
import { RoleGuard } from '../../../../lib/user/guards/role.guard';
import { ProjectRepository } from '../../../../lib/project/repositories/project.repository';
import { ProjectOutputRepository } from '../../../../lib/project/repositories/project_output.repository';
import { AuthGuard } from '../../../../lib/auth/guards/auth.guard';
import { CreateProjectOutputSchema } from '../../../../lib/project/schemas/project_output.schema';
import * as yup from 'yup';
import { ProjectStatus } from '../../../../lib/project/interfaces/project.interface';

const idQuerySchema = yup.object().shape({
	id: yup.string().uuid().required(),
});

const projectRepository = new ProjectRepository();
const projectOuputRepository = new ProjectOutputRepository();

const handleGet = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	const { page = 1, limit = 10 } = req.query;

	const options = {
		page: +page,
		limit: +limit,
	};
	const result = await projectOuputRepository.getPaginated(options);

	res.json(result);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponseWCustom) => {
	const projectId = (req.query.id || '') as string;
	const project = await projectRepository.getOneById(projectId);

	if (project.status !== ProjectStatus.Ended) {
		return res.badRequest({
			message: 'Please end the project first',
		});
	}

	const data = {
		...req.body,
		projectId,
	};

	const projectOutput = await projectOuputRepository.create(data);

	res.json(projectOutput);
};

export default Endpoints.get(handleGet, [AuthGuard, RoleGuard(['Admin'])])
	.post(handlePost, [
		AuthGuard,
		RoleGuard(['Admin']),
		QueryValidation(idQuerySchema),
		BodyValidation(CreateProjectOutputSchema),
	])
	.go();

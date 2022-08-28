// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
	Endpoints,
	NextApiResponseWCustom,
	QueryValidation,
	NextApiRequestWAuth,
} from '../../../../lib/helpers';
import { RoleGuard } from '../../../../lib/user/guards/role.guard';
import { ProjectRepository } from '../../../../lib/project/repositories/project.repository';
import { AuthGuard } from '../../../../lib/auth/guards/auth.guard';
import * as yup from 'yup';
import { ProjectStatus } from '../../../../lib/project/interfaces/project.interface';

const idQuerySchema = yup.object().shape({
	id: yup.string().uuid().required(),
});

const projectRepository = new ProjectRepository();

const handlePost = async (
	req: NextApiRequestWAuth,
	res: NextApiResponseWCustom
) => {
	const projectId = (req.query.id || '') as string;
	const project = await projectRepository.getOneById(projectId);

	if (project.userId !== req.user?.id)
		return res.badRequest({
			message: "Can't start if the project is not yours",
		});

	if (project.status !== ProjectStatus.Pending)
		return res.badRequest({
			message: "Can't start the project",
		});

	const result = await projectRepository.updateStatus(
		projectId,
		ProjectStatus.Started
	);

	res.json(result);
};

export default Endpoints.post(handlePost, [
	AuthGuard,
	RoleGuard(['Admin']),
	QueryValidation(idQuerySchema),
]).go();

import { Repository } from '../../helpers';
import { ProjectStatus } from '../interfaces/project.interface';
import { CreateProjectDto, UpdateProjectDto } from '../schemas/project.schema';

export class ProjectRepository extends Repository<
	CreateProjectDto,
	UpdateProjectDto
> {
	model = this.prisma.project;

	async getOneById(id: string) {
		const project = await this.model.findFirst({
			include: {
				projectOutput: true,
			},
			where: {
				id,
			},
		});

		let apy = 0;

		if (project?.budget && project?.projectOutput[0].amount) {
			apy = Math.floor(
				(project.projectOutput[0].amount / project.budget - 1) * 100
			);
		}

		return {
			...project,
			apy,
			investments: await this.prisma.investment.aggregate({
				_count: true,
				_sum: {
					amount: true,
				},
				where: {
					projectId: id,
				},
			}),
		};
	}

	async updateStatus(id: string, status: ProjectStatus) {
		return this.model.update({
			data: {
				status,
			},
			where: {
				id,
			},
		});
	}
}

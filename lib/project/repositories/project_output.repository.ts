import { Repository } from '../../helpers';
import { CreateProjectOutputDto } from '../schemas/project_output.schema';

export class ProjectOutputRepository extends Repository<CreateProjectOutputDto> {
	model = this.prisma.project_output;
}

import { Repository } from '../../helpers';
import { CreateCompanyDto, UpdateCompanyDto } from '../schemas/company.schema';

export class CompanyRepository extends Repository<
	CreateCompanyDto,
	UpdateCompanyDto
> {
	model = this.prisma.company;
}

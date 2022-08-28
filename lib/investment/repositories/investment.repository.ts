import { Repository } from '../../helpers';
import {
	CreateInvestmentDto,
	UpdateInvestmentDto,
} from '../schemas/investment.schema';

export class InvestmentRepository extends Repository<
	CreateInvestmentDto,
	UpdateInvestmentDto
> {
	model = this.prisma.investment;

	async getTotalInvesmentByProjectId(id: string) {
		const result = await this.model.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				projectId: id,
			},
		});

		return result._sum.amount;
	}
}

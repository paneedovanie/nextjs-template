// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
	checkPrismaError,
	Endpoints,
	BodyValidation,
} from '../../../lib/helpers';
import { RoleGuard } from '../../../lib/user/guards/role.guard';
import { CompanyRepository } from '../../../lib/company/repositories/company.repository';
import { AuthGuard } from '../../../lib/auth/guards/auth.guard';
import { CreateCompanySchema } from '../../../lib/company/schemas/company.schema';
import { StatusCodes } from 'http-status-codes';

const companyRepository = new CompanyRepository();

const handleGet = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	const { page = 1, limit = 10 } = req.query;

	const options = {
		page: +page,
		limit: +limit,
	};
	const result = await companyRepository.getPaginated(options);

	res.json(result);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	try {
		const company = await companyRepository.create(req.body);

		res.status(StatusCodes.CREATED).json(company);
	} catch (error: any) {
		const errors = checkPrismaError(error);
		if (errors)
			res.status(StatusCodes.BAD_REQUEST).send({
				message: 'Invalid input',
				errors,
			});
		else
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
				message: error.message,
			});
	}
};

export default Endpoints.get(handleGet)
	.post(handlePost, [
		AuthGuard,
		RoleGuard(['Admin']),
		BodyValidation(CreateCompanySchema),
	])
	.go();

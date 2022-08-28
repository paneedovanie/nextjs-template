// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import {
	checkPrismaError,
	BadRequestResponse,
	CreatedResponse,
	Endpoints,
	BodyValidation,
} from '../../../lib/helpers';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../../../lib/user/repositories/user.repository';

const registerSchema = yup.object().shape({
	firstName: yup.string().required(),
	lastName: yup.string().required(),
	email: yup.string().required(),
	password: yup.string().required(),
});

const userRepository = new UserRepository();

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const user = await userRepository.create(req.body);

		const tokenSecret = process.env.TOKEN_SECRET;
		const tokenExpiration = process.env.TOKEN_EXPIRATION;
		const token = sign(user, tokenSecret || 'Secret', {
			expiresIn: tokenExpiration || '1d',
		});

		res.json({
			token,
			user,
		});
	} catch (error: any) {
		const errors = checkPrismaError(error);
		if (errors) BadRequestResponse.setData(errors).go(res);
		else BadRequestResponse.setMessage(error.message).go(res);
	}
};

export default Endpoints.post(handlePost, [
	BodyValidation(registerSchema),
]).go();

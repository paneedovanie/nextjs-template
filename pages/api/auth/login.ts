// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
	BodyValidation,
	Endpoints,
	NextApiRequestWAuth,
	NextApiResponseWCustom,
} from '../../../lib/helpers';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserPrivateRepository } from '../../../lib/user/repositories/user-private.repository';
import { LoginSchema } from '../../../lib/auth/schemas/login.schema';

const userPrivateRepository = new UserPrivateRepository();

const handlePost = async (
	req: NextApiRequestWAuth,
	res: NextApiResponseWCustom
) => {
	const { email, password } = req.body;

	const userPrivate = await userPrivateRepository.getOneByEmail(email);

	if (!userPrivate || !compareSync(password, userPrivate.password))
		return res.unauthorize();

	const { user } = userPrivate;
	const tokenSecret = process.env.TOKEN_SECRET;
	const tokenExpiration = process.env.TOKEN_EXPIRATION;
	const token = sign(user, tokenSecret || 'Secret', {
		expiresIn: tokenExpiration || '1d',
	});

	res.json({
		token,
		user,
	});
};

export default Endpoints.post(handlePost, [BodyValidation(LoginSchema)]).go();

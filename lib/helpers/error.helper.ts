import { Prisma } from '@prisma/client';

export enum PrismaErrorCode {
	Duplicate = 'P2002',
	Missing = 'P2003',
}

export const checkPrismaError = (
	error: Prisma.PrismaClientKnownRequestError
) => {
	let message = '';

	if (PrismaErrorCode.Duplicate === error.code) {
		message = 'Already in used';
	}

	if (error.meta) {
		return Object.keys(error.meta).reduce(
			(curr, key) => ({
				...curr,
				[key]: message,
			}),
			{}
		);
	}

	return {};
};

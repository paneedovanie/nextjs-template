import * as yup from 'yup';
import { NextApiRequest, NextApiResponse } from 'next';
import { BadRequestResponse } from './response.helper';
import { Middleware } from './endpoint.helper';
import { NextApiRequestWAuth } from './endpoint.helper';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const validate = (
	schema: yup.ObjectSchema<any>,
	data: { [key: string]: any }
) => {
	try {
		schema
			.noUnknown()
			.validateSync(data, { abortEarly: false, stripUnknown: false });

		return {
			data: schema.cast(data),
		};
	} catch (error: any) {
		const reducer = (object: { [key: string]: any }, item: any) => ({
			...object,
			[item.path]: item.errors,
		});
		const errors = error.inner.reduce(reducer, {});
		return { errors };
	}
};

export const BodyValidation = (schema: yup.ObjectSchema<any>) =>
	class extends Middleware {
		handle(
			req: NextApiRequestWAuth,
			res: NextApiResponse<any>
		): boolean | void | Promise<boolean | void> {
			const { errors, data } = validate(schema, req.body);
			req.body = data;

			if (!errors) return true;

			res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Invalid input',
				errors,
			});

			return false;
		}
	};

export const QueryValidation = (schema: yup.ObjectSchema<any>) =>
	class extends Middleware {
		handle(
			req: NextApiRequestWAuth,
			res: NextApiResponse<any>
		): boolean | void | Promise<boolean | void> {
			const { errors, data } = validate(schema, req.query);
			req.query = data as Partial<{ [key: string]: string | string[] }>;

			if (!errors) return true;

			res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Invalid input',
				errors,
			});

			return false;
		}
	};

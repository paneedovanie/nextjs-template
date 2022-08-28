import { NextApiRequest, NextApiResponse } from 'next';
import { NotFoundResponse } from './response.helper';
import { role, user, user_role } from '@prisma/client';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { verify } from 'jsonwebtoken';
import { checkPrismaError } from './error.helper';

export type auth = user & { userRoles?: user_role & { role: role }[] };

export type NextApiRequestWAuth = NextApiRequest & {
	user?: auth;
};

enum CustomKey {
	Unauthorize = 'unauthorize',
	InternalServerError = 'internalServerError',
	BadRequest = 'badRequest',
	NotFound = 'notFound',
}

enum StatusCodeKey {
	Unauthorize = 'UNAUTHORIZED',
	InternalServerError = 'INTERNAL_SERVER_ERROR',
	BadRequest = 'BAD_REQUEST',
	NotFound = 'NOT_FOUND',
}

const customs = new Map<CustomKey, StatusCodeKey>();
customs.set(CustomKey.Unauthorize, StatusCodeKey.Unauthorize);
customs.set(CustomKey.InternalServerError, StatusCodeKey.InternalServerError);
customs.set(CustomKey.BadRequest, StatusCodeKey.BadRequest);
customs.set(CustomKey.NotFound, StatusCodeKey.NotFound);

export type NextApiResponseWCustom = NextApiResponse & {
	[CustomKey.Unauthorize]: (options?: { message?: string; data?: any }) => void;
	[CustomKey.InternalServerError]: (options?: {
		message?: string;
		data?: any;
	}) => void;
	[CustomKey.BadRequest]: (options?: { message?: string; data?: any }) => void;
	[CustomKey.NotFound]: (options?: { message?: string; data?: any }) => void;
};

export type EndpointHandler = (
	req: NextApiRequestWAuth,
	res: NextApiResponseWCustom
) => void;

export class Middleware {
	constructor(
		protected req: NextApiRequestWAuth,
		protected res: NextApiResponse
	) {}

	handle(
		req: NextApiRequestWAuth,
		res: NextApiResponse
	): Promise<boolean | void> | boolean | void {
		return true;
	}

	async go() {
		return this.handle(this.req, this.res);
	}
}

export class Interceptor extends Middleware {
	async handle(req: NextApiRequestWAuth, res: NextApiResponse) {}

	async go() {
		await this.handle(this.req, this.res);
		return true;
	}
}

type MiddlewareConstructor = {
	new (req: NextApiRequestWAuth, res: NextApiResponse): Middleware;
};

type EndpointConfig = {
	handler: EndpointHandler;
	middlewares?: MiddlewareConstructor[];
};

export class Endpoints {
	private static _get?: EndpointConfig;
	private static _post?: EndpointConfig;
	private static _put?: EndpointConfig;
	private static _patch?: EndpointConfig;
	private static _delete?: EndpointConfig;

	static get(handler: EndpointHandler, middlewares?: MiddlewareConstructor[]) {
		this._get = { handler, middlewares };
		return this;
	}

	static post(handler: EndpointHandler, middlewares?: MiddlewareConstructor[]) {
		this._post = { handler, middlewares };
		return this;
	}

	static put(handler: EndpointHandler, middlewares?: MiddlewareConstructor[]) {
		this._put = { handler, middlewares };
		return this;
	}

	static patch(
		handler: EndpointHandler,
		middlewares?: MiddlewareConstructor[]
	) {
		this._patch = { handler, middlewares };
		return this;
	}

	static delete(
		handler: EndpointHandler,
		middlewares?: MiddlewareConstructor[]
	) {
		this._delete = { handler, middlewares };
		return this;
	}

	private static addCustomProperties(
		req: NextApiRequestWAuth,
		res: NextApiResponseWCustom
	) {
		try {
			const authorization = req.headers.authorization;
			if (authorization) {
				const token = authorization?.replace('Bearer ', '');
				const decoded = verify(token, process.env.TOKEN_SECRET || '');
				req.user = decoded as auth;
			}
		} catch (err) {}

		customs.forEach((value: StatusCodeKey, key: CustomKey) => {
			res[key] = (options) =>
				res.status(StatusCodes[value]).json({
					message: options?.message || ReasonPhrases[value],
					data: options?.data,
				});
		});
	}

	private static async createEndpoints(
		req: NextApiRequestWAuth,
		res: NextApiResponseWCustom
	) {
		Endpoints.addCustomProperties(req, res);

		const key = ('_' + req.method?.toLocaleLowerCase()) as keyof Endpoints;
		const config = Endpoints[key] as EndpointConfig;
		if (!config) NotFoundResponse.go(res);

		if (config?.middlewares) {
			for (const M of config.middlewares) {
				const m = new M(req, res);
				const result = await m.go();
				if (typeof result === 'boolean' && !result) return;
			}
		}

		try {
			await config?.handler?.(req, res);
		} catch (error: any) {
			console.log(error);
			const errors = checkPrismaError(error);
			if (errors && Object.keys(errors).length)
				res.badRequest({ data: errors });
			else res.internalServerError({ message: error.message });
		}

		// Endpoints._get = undefined;
		// Endpoints._post = undefined;
		// Endpoints._put = undefined;
		// Endpoints._patch = undefined;
		// Endpoints._delete = undefined;
	}

	static go() {
		return this.createEndpoints;
	}
}

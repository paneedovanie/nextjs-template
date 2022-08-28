import { NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

class ResponseReturn {
	constructor(
		public code: StatusCodes = StatusCodes.OK,
		public reason: ReasonPhrases = ReasonPhrases.OK,
		public message?: string,
		public data?: any
	) {}
}

export class Response {
	protected static _code = StatusCodes.OK;
	protected static _reason: ReasonPhrases = ReasonPhrases.OK;
	protected static _message?: string = undefined;
	protected static _data?: any = undefined;

	static setCode(code: StatusCodes) {
		this._code = code;
		return this;
	}

	static setReason(reason: ReasonPhrases) {
		this._reason = reason;
		return this;
	}

	static setMessage(message: string) {
		this._message = message;
		return this;
	}

	static setData(data: any) {
		this._data = data;
		return this;
	}

	static go(res: NextApiResponse) {
		const { reason, message, data } = new ResponseReturn(
			this._code,
			this._reason,
			this._message,
			this._data
		);

		res.status(this._code).json({
			reason,
			message,
			data,
		});

		this._message = undefined;
		this._data = undefined;
	}
}

export class NotFoundResponse extends Response {
	static _code = StatusCodes.NOT_FOUND;
	static _reason = ReasonPhrases.NOT_FOUND;
}

export class BadRequestResponse extends Response {
	static _code = StatusCodes.BAD_REQUEST;
	static _reason = ReasonPhrases.BAD_REQUEST;
}

export class UnauthorizedResponse extends Response {
	static _code = StatusCodes.UNAUTHORIZED;
	static _reason = ReasonPhrases.UNAUTHORIZED;
}

export class CreatedResponse extends Response {
	static _code = StatusCodes.CREATED;
	static _reason = ReasonPhrases.CREATED;
}

import * as yup from 'yup';

export const LoginSchema = yup
	.object()
	.shape({
		email: yup.string().email().required(),
		password: yup.string().required(),
	})
	.required();

export type LoginDto = yup.InferType<typeof LoginSchema>;

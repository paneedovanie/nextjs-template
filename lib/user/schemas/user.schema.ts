import * as yup from 'yup';

export const CreateUserSchema = yup
	.object()
	.shape({
		firstName: yup.string().required(),
		middleName: yup.string(),
		lastName: yup.string().required(),
		email: yup.string().required(),
		password: yup.string().required(),
	})
	.required();

export type CreateUserDto = yup.InferType<typeof CreateUserSchema>;

export const UpdateUserSchema = yup.object().shape({
	firstName: yup.string().required(),
	middleName: yup.string(),
	lastName: yup.string().required(),
});

export type UpdateUserDto = yup.InferType<typeof UpdateUserSchema>;

export const UpdateRoleSchema = yup.object().shape({
	roleIds: yup.array().of(yup.number().required()).required(),
});

export type UpdateRoleDto = yup.InferType<typeof UpdateRoleSchema>;

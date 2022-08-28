import * as yup from 'yup';

export const CreateCompanySchema = yup
	.object()
	.shape({
		name: yup.string().required(),
		description: yup.string().required(),
		userId: yup.string(),
	})
	.required();

export type CreateCompanyDto = yup.InferType<typeof CreateCompanySchema>;

export const UpdateCompanySchema = yup.object().shape({
	name: yup.string().required(),
	description: yup.string().required(),
	userId: yup.string(),
});

export type UpdateCompanyDto = yup.InferType<typeof UpdateCompanySchema>;

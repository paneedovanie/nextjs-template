import * as yup from 'yup';

export const CreateProjectSchema = yup.object().shape({
	name: yup.string().required(),
	description: yup.string().required(),
	companyId: yup.string().required(),
	startAt: yup.date().required(),
	endAt: yup.date().required(),
	budget: yup.number().required(),
	commission: yup.number().required(),
});

export type CreateProjectDto = yup.InferType<typeof CreateProjectSchema>;

export const UpdateProjectSchema = yup.object().shape({
	name: yup.string().required(),
	description: yup.string().required(),
	companyId: yup.string().required(),
	startAt: yup.date().required(),
	endAt: yup.date().required(),
	budget: yup.number().required(),
	commission: yup.number().required(),
	status: yup.string().required(),
});

export type UpdateProjectDto = yup.InferType<typeof UpdateProjectSchema>;

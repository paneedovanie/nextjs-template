import * as yup from 'yup';

export const CreateCategorySchema = yup.object().shape({
	name: yup.string().required(),
	type: yup.string().required(),
});

export type CreateCategoryDto = yup.InferType<typeof CreateCategorySchema>;

export const UpdateCategorySchema = yup.object().shape({
	name: yup.string().required(),
	type: yup.string().required(),
});

export type UpdateCategoryDto = yup.InferType<typeof UpdateCategorySchema>;

import * as yup from 'yup';

export const CreateProjectOutputSchema = yup.object().shape({
	amount: yup.number().min(1).required(),
});

export type CreateProjectOutputDto = yup.InferType<
	typeof CreateProjectOutputSchema
>;

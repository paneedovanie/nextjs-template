import * as yup from 'yup';

export const CreateInvestmentSchema = yup.object().shape({
	amount: yup.number().min(1).required(),
	projectId: yup.string().required(),
});

export type CreateInvestmentDto = yup.InferType<typeof CreateInvestmentSchema>;

export const UpdateInvestmentSchema = yup.object().shape({
	amount: yup.number().min(1).required(),
	projectId: yup.string().required(),
});

export type UpdateInvestmentDto = yup.InferType<typeof UpdateInvestmentSchema>;

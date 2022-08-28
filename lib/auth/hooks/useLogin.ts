import { useMutation } from 'react-query';
import axios from 'axios';
import { LoginDto } from '../schemas/login.schema';
import { user } from '@prisma/client';

export const login = async (data: LoginDto) => {
	try {
		const response = await axios.post('/api/auth/login', data);
		return response?.data;
	} catch (error: any) {
		throw error.response.data;
	}
};

export const useLogin = () =>
	useMutation<
		{
			token: string;
			user: user;
		},
		Error,
		LoginDto
	>('login', login);

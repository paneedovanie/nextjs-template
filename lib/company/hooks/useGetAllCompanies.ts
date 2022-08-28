import { useQuery } from 'react-query';
import axios from 'axios';

export const getAllCompanies = async () => {
	const response = await axios.get('/api/companies');
	return response?.data;
};

export const useGetAllCompanies = () =>
	useQuery('getAllCompanies', getAllCompanies);

import { useQuery } from 'react-query';
import axios from 'axios';

export const getAllUsers = () => axios.get('/api/users');

export const useGetAllUsers = () => useQuery('getAllUsers', getAllUsers);

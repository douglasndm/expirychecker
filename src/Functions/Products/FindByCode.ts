import axios, { AxiosError } from 'axios';
import api from '@services/API';

interface IResponse {
	name: string;
	code: string;
	brand?: string;
	thumbnail?: string;
}

async function findProductByCode(code: string): Promise<IResponse | null> {
	try {
		const response = await api.get<IResponse>(
			`/products/search?query=${code}`
		);

		if (response.data !== null) {
			return response.data;
		}
	} catch (error: unknown | AxiosError) {
		if (axios.isAxiosError(error)) {
			if (error.code === 'ERR_NETWORK') {
				return null;
			}
		}
		throw error;
	}
	return null;
}

export { findProductByCode };

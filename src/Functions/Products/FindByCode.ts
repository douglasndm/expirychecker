import api from '@services/API';

interface IResponse {
	name: string;
	code: string;
	brand?: string;
	thumbnail?: string;
}

async function findProductByCode(code: string): Promise<IResponse | null> {
	try {
		const response = await api.get<IResponse>(`/product/${code}`);

		if (response.data !== null) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
	}
	return null;
}

export { findProductByCode };

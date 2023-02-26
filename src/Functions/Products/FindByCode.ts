import api from '@services/API';

interface IResponse {
	name: string;
	code: string;
	brand?: string;
	thumbnail?: string;
}

async function findProductByCode(code: string): Promise<IResponse | null> {
	const response = await api.get<IResponse>(`/product/${code}`);

	if (response.data !== null) {
		return response.data;
	}
	return null;
}

export { findProductByCode };

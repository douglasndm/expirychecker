import api from '~/Services/API';

interface findProductByCodeResponse {
    name: string;
    code: string;
    brand?: string;
    thumbnail?: string;
}

async function findProductByCode(
    code: string
): Promise<findProductByCodeResponse | null> {
    try {
        const response = await api.get<findProductByCodeResponse>(
            `/products/search?query=${code}`
        );

        if (response.data !== null) {
            return response.data;
        }
        return null;
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
    }

    return null;
}

export { findProductByCode };

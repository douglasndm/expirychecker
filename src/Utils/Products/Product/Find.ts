import realm from '@expirychecker/Services/Realm';

interface findProductByCodeProps {
	code: string;
	store_id?: string;
}

async function findProductByCode({
	code,
	store_id,
}: findProductByCodeProps): Promise<IProduct | null> {
	return new Promise((resolve, _) => {
		const [result] = realm
			.objects<IProduct>('Product')
			.filtered(
				`code ==[c] "${code}"${
					!!store_id ? ` AND store ==[c] "${store_id}"` : ''
				}`
			);

		if (result) {
			resolve(result);
		} else {
			resolve(null);
		}
	});
}

export { findProductByCode };

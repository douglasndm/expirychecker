import { UpdateMode } from 'realm';
import {
	setHours,
	setMinutes,
	setSeconds,
	setMilliseconds,
	parseISO,
} from 'date-fns';

import realm from '@expirychecker/Services/Realm';

import { getProductByCode, getProductById } from './Product';

export function removeLotesTratados(batches: Array<IBatch>): Array<IBatch> {
	// Não sei pq o certo mas o Realm transformou o array em uma coleção de objetos
	// e sendo objetos não consigo fazer o sort deles usando as funções nativas do javscript
	// solução -> percorrer todo o objeto de lotes e colocar cada um dentro de um array temporario
	// para ai sim ser possível fazer o sort
	const arrayTemp = batches.map(b => b); // READ BEFORE DELETE

	const results = arrayTemp.filter(batch => {
		if (batch.status === 'Tratado') return false;
		return true;
	});

	return results;
}

interface checkIfLoteAlreadyExistsProps {
	loteName: string;
	productCode?: string;
	productId?: number;
}

export async function checkIfLoteAlreadyExists({
	loteName,
	productCode,
	productId,
}: checkIfLoteAlreadyExistsProps): Promise<boolean> {
	let product: IProduct;

	if (productCode) {
		const prod = await getProductByCode({
			productCode,
		});

		if (!prod) {
			throw new Error('Não foi possível encontrar o produto');
		}

		product = prod;
	} else if (productId) {
		const prod = await getProductById(productId);

		if (!prod) {
			throw new Error('Não foi possível encontrar o produto');
		}

		product = prod;
	} else {
		throw new Error(
			'ID do produto ou código devem ser passados para verificar se o lote já existe'
		);
	}

	const productsLotes = product.batches.filter(l => {
		if (l.name.toLowerCase() === loteName.toLowerCase()) {
			return true;
		}
		return false;
	});

	if (productsLotes.length > 0) {
		return true;
	}

	return false;
}

export async function getLoteById(loteId: number): Promise<IBatch> {
	const result = realm
		.objects<IBatch>('Lote')
		.filtered(`id = "${loteId}"`)[0];

	return result;
}

interface createLoteProps {
	lote: Omit<IBatch, 'id'>;
	productCode?: string;
	productId?: number;
	ignoreDuplicate?: boolean;
}

export async function createLote({
	lote,
	productCode,
	productId,
	ignoreDuplicate = false,
}: createLoteProps): Promise<void> {
	if (
		productCode &&
		ignoreDuplicate === false &&
		(await checkIfLoteAlreadyExists({ productCode, loteName: lote.name }))
	) {
		throw new Error('Já existe o mesmo lote cadastro');
	} else if (
		productId &&
		ignoreDuplicate === false &&
		(await checkIfLoteAlreadyExists({ productId, loteName: lote.name }))
	) {
		throw new Error('Já existe o mesmo lote cadastro');
	}

	realm.write(async () => {
		let product;

		if (productCode) {
			product = realm
				.objects<IProduct>('Product')
				.filtered(`code = "${productCode}"`)
				.slice();
		} else {
			product = realm
				.objects<IProduct>('Product')
				.filtered(`id = "${productId}"`)
				.slice();
		}

		if (product.length < 1) {
			throw new Error(
				'Produto não encontrado, não é possível adicionar o lote'
			);
		}

		const lastLote = realm.objects<IBatch>('Lote').sorted('id', true)[0];
		const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

		// UM MONTE DE SETS PARA DEIXAR A HORA COMPLETAMENTE ZERADA
		// E CONSIDERAR APENAS OS DIAS NO CONTROLE DE VENCIMENTO
		let formatedDate = new Date();

		if (typeof lote.exp_date === 'string') {
			formatedDate = setHours(
				setMinutes(
					setSeconds(setMilliseconds(parseISO(lote.exp_date), 0), 0),
					0
				),
				0
			);
		} else {
			formatedDate = setHours(
				setMinutes(setSeconds(setMilliseconds(lote.exp_date, 0), 0), 0),
				0
			);
		}

		product[0].batches.push({
			id: nextLoteId,
			name: lote.name,
			exp_date: formatedDate,
			amount: lote.amount,
			price: lote.price,
			status: lote.status,

			created_at: new Date(),
			updated_at: new Date(),
		});

		// send the product reference only to update the "updated_at" field
		product[0].updated_at = new Date();
	});
}

// send the product reference only to update the "updated_at" field
export async function updateLote(
	batch: IBatch,
	product: IProduct
): Promise<void> {
	realm.write(() => {
		realm.create(
			'Lote',
			{
				...batch,
				updated_at: new Date(),
			},
			UpdateMode.Modified
		);

		realm.create(
			'Product',
			{
				...product,
				id: product.id,
				updated_at: new Date(),
			},
			UpdateMode.Modified
		);
	});
}

function deleteLote(batch_id: number, product: IProduct): void {
	const batch = realm.objects<IBatch>('Lote').filtered(`id = "${batch_id}"`);

	realm.write(() => {
		realm.delete(batch);

		realm.create(
			'Product',
			{
				...product,
				id: product.id,
				updated_at: new Date(),
			},
			UpdateMode.Modified
		);
	});
}

export { deleteLote };

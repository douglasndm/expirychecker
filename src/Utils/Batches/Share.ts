import { format } from 'date-fns';
import { ptBR, pt, enUS } from 'date-fns/locale';
import { getLocales, getCurrencies } from 'react-native-localize';
import { formatCurrency } from 'react-native-format-currency';

import strings from '@expirychecker/Locales';

let languageCode = ptBR;
if (getLocales()[0].languageCode === 'pt') {
	languageCode = pt;
} else if (getLocales()[0].languageCode !== 'BR') {
	languageCode = enUS;
}

let dateFormat = 'dd/MM/yyyy';
if (getLocales()[0].languageCode === 'en') {
	dateFormat = 'MM/dd/yyyy';
}

function shareString(product: IProduct, batch: IBatch): string {
	const exp_date = format(batch.exp_date, dateFormat, {
		locale: languageCode,
	});

	let text = strings.View_ShareProduct_Message;

	if (!!batch.amount && batch.amount > 0) {
		if (!!batch.price_tmp) {
			text = strings.View_ShareProduct_MessageWithDiscountAndAmount;

			text = text.replace(
				'{TMP_PRICE}',
				formatCurrency({
					amount: Number(batch.price_tmp.toFixed(2)),
					code: getCurrencies()[0],
				})[0]
			);
			text = text.replace(
				'{TOTAL_DISCOUNT_PRICE}',
				formatCurrency({
					amount: Number((batch.price_tmp * batch.amount).toFixed(2)),
					code: getCurrencies()[0],
				})[0]
			);
		} else {
			text = strings.View_ShareProduct_MessageWithAmount;
		}
		text = text.replace('{AMOUNT}', String(batch.amount));
	} else if (!!batch.price) {
		text = strings.View_ShareProduct_MessageWithPrice;

		if (!!batch.price_tmp) {
			text = strings.View_ShareProduct_MessageWithDiscount;
			text = text.replace('{TMP_PRICE}', batch.price_tmp.toString());
		}

		text = text.replace(
			'{PRICE}',
			formatCurrency({
				amount: Number(batch.price.toFixed(2)),
				code: getCurrencies()[0],
			})[0]
		);
	}

	if (!!product.code) {
		text = text.replace(
			'{PRODUCT}',
			`{PRODUCT} ${strings.View_ShareProduct_MessageCodeBetween}`
		);

		text = text.replace('{CODE}', product.code);
	}

	text = text.replace('{PRODUCT}', product.name);
	text = text.replace('{DATE}', exp_date);

	return text;
}

export { shareString };

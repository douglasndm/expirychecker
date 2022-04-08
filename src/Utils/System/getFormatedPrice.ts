import { getCurrentLocale } from './getLocale';

function getCurrencySymbol(currency: string): string {
    return (0)
        .toLocaleString(getCurrentLocale(), {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
        .replace(/\d/g, '')
        .trim();
}

function getFormatedPrice(price: number): string {
    return price.toLocaleString(getCurrentLocale(), {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export { getFormatedPrice, getCurrencySymbol };

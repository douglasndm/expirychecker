import { getCurrentLocale } from './getLocale';

function getFormatedPrice(price: number): string {
    return price.toLocaleString(getCurrentLocale(), {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export { getFormatedPrice };

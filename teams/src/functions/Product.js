import Realm from '../Services/Realm';

export async function checkIfProductAlreadyExistsByCode(productCode) {
    try {
        const realm = await Realm();

        const results = realm
            .objects('Product')
            .filtered(`code = "${productCode}"`)
            .slice();

        if (results.length > 0) {
            return true;
        }
        return false;
    } catch (err) {
        console.warn(err);
    }

    return false;
}

export async function getProductByCode(productCode) {
    try {
        const realm = await Realm();

        const result = realm
            .objects('Product')
            .filtered(`code = "${productCode}"`)[0];

        return result;
    } catch (err) {
        console.warn(err);
    }

    return null;
}

export async function getProductById(productId) {
    try {
        const realm = await Realm();

        const result = realm
            .objects('Product')
            .filtered(`id = "${productId}"`)[0];

        return result;
    } catch (err) {
        console.warn(err);
    }

    return null;
}

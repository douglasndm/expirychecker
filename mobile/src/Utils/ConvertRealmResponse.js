export function convertToArray(realmObjectsArray) {
    const copyOfJsonArray = Array.from(realmObjectsArray);
    const jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
    return jsonArray;
}

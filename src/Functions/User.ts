import AsyncStorage from '@react-native-community/async-storage';
import UUIDGenerator from 'react-native-uuid-generator';

export async function generateUserId(): Promise<string> {
    try {
        const id = await UUIDGenerator.getRandomUUID();

        await AsyncStorage.setItem('UserId', id);

        return id;
    } catch (err) {
        throw new Error(err);
    }
}

export async function getUserId(): Promise<string> {
    try {
        const id = await AsyncStorage.getItem('UserId');

        if (!id) {
            const generatedId = await generateUserId();

            return generatedId;
        }

        return id;
    } catch (err) {
        throw new Error(err);
    }
}

import AsyncStorage from '@react-native-community/async-storage';

export async function getUserId(): Promise<string> {
    try {
        const id = await AsyncStorage.getItem('UserId');

        if (!id) {
            throw new Error('User ID was not found. Are you signed in?');
        }

        return id;
    } catch (err) {
        throw new Error(err);
    }
}

export async function setUserId(id: string): Promise<void> {
    try {
        await AsyncStorage.setItem('UserId', id);
    } catch (err) {
        throw new Error(err);
    }
}

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUserId(): Promise<string> {
    const id = await AsyncStorage.getItem('UserId');

    if (!id) {
        return '';
    }

    return id;
}

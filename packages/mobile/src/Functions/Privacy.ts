import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setAllowedToReadIDFA(allow: boolean): Promise<void> {
    await AsyncStorage.setItem('Privacy/canUseIDFA', String(allow));
}

export async function getAllowedToReadIDFA(): Promise<boolean | null> {
    const response = await AsyncStorage.getItem('Privacy/canUseIDFA');

    if (response) {
        if (response === 'false') {
            return false;
        }

        return true;
    }
    return null;
}

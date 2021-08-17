import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUserId(): Promise<string> {
    const id = await AsyncStorage.getItem('UserId');

    if (!id) {
        return '';
    }

    return id;
}

export async function getUserInfo(): Promise<IUser | null> {
    const userInfo = await AsyncStorage.getItem('User');

    if (!userInfo) {
        return null;
    }

    const user: IUser = JSON.parse(userInfo);

    return user;
}

export async function setUserId(id: string): Promise<void> {
    await AsyncStorage.setItem('UserId', id);
}

export async function setUserInfo(user: IUser): Promise<void> {
    await AsyncStorage.setItem('User', JSON.stringify(user));
}

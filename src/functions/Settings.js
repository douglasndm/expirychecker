import AsyncStorange from '@react-native-community/async-storage';

export async function getDaysToBeNextToExp() {
    try {
        const days = await AsyncStorange.getItem('settings/daysToBeNext');

        if (days != null) return days;
    } catch (err) {
        console.tron(err);
    }

    return 30;
}

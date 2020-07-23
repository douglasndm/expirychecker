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

export async function getDarkModeEnabled() {
    try {
        const getDarkModeSetting = await AsyncStorange.getItem(
            'settings/darkMode'
        );

        if (getDarkModeSetting != null) {
            if (getDarkModeSetting === 'true') {
                return true;
            }
            return false;
        }
        return false;
    } catch (err) {
        console.warn(err);
    }

    return false;
}

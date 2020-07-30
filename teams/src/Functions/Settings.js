import AsyncStorange from '@react-native-community/async-storage';
import Realm from '../Services/Realm';

export async function getDaysToBeNextToExp() {
    try {
        const days = await AsyncStorange.getItem('settings/daysToBeNext');

        if (days != null) return days;
    } catch (err) {
        console.tron(err);
    }

    return 30;
}

export async function getAppTheme() {
    try {
        const realm = await Realm();

        const appTheme = await realm
            .objects('Setting')
            .filtered("name = 'appTheme'")[0];

        if (!appTheme) {
            return 'system';
        }

        return appTheme.value;
    } catch (err) {
        console.log(err.message);
    }

    return 'system';
}

export async function setAppTheme(theme) {
    try {
        const realm = await Realm();

        realm.write(() => {
            realm.create(
                'Setting',
                {
                    name: 'appTheme',
                    value: theme.trim(),
                },
                true
            );
        });
    } catch (err) {
        console.log(err);
    }
}

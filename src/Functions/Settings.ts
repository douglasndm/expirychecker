import Realm from '../Services/Realm';

export async function getDaysToBeNextToExp() {
    try {
        const realm = await Realm();

        const daysToBeNext = await realm
            .objects('Setting')
            .filtered("name = 'daysToBeNext'")[0];

        if (daysToBeNext && daysToBeNext !== null) {
            return daysToBeNext.value;
        }
    } catch (err) {
        console.tron(err);
    }

    return 30;
}

export async function setDaysToBeNextToExp(days) {
    try {
        const realm = await Realm();

        realm.write(() => {
            realm.create(
                'Setting',
                {
                    name: 'daysToBeNext',
                    value: days.trim(),
                },
                true
            );
        });
    } catch (err) {
        console.warn(err);
    }
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
        console.warn(err.message);
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
        console.warn(err);
    }
}

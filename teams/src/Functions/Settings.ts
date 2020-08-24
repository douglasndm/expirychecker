import Realm from '../Services/Realm';

interface ISetting {
    name: string;
    value?: string;
}

export async function getDaysToBeNextToExp(): Promise<number> {
    try {
        const realm = await Realm();

        const daysToBeNext = await realm
            .objects<ISetting>('Setting')
            .filtered("name = 'daysToBeNext'")[0];

        if (daysToBeNext && daysToBeNext !== null) {
            return Number(daysToBeNext.value);
        }
    } catch (err) {
        console.warn(err);
    }

    return 30;
}

export async function setDaysToBeNextToExp(days: number): Promise<void> {
    try {
        const realm = await Realm();

        realm.write(() => {
            realm.create(
                'Setting',
                {
                    name: 'daysToBeNext',
                    value: days,
                },
                true
            );
        });
    } catch (err) {
        console.warn(err);
    }
}

export async function getAppTheme(): Promise<string> {
    try {
        const realm = await Realm();

        const appTheme = await realm
            .objects<ISetting>('Setting')
            .filtered("name = 'appTheme'")[0];

        return appTheme.value || 'system';
    } catch (err) {
        console.warn(err.message);
    }

    return 'system';
}

export async function setAppTheme(themeName: string): Promise<void> {
    try {
        const realm = await Realm();

        realm.write(() => {
            realm.create(
                'Setting',
                {
                    name: 'appTheme',
                    value: themeName.trim(),
                },
                true
            );
        });
    } catch (err) {
        console.warn(err);
    }
}

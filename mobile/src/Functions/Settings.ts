import AsyncStorange from '@react-native-community/async-storage';

import Realm from '../Services/Realm';

interface ISetting {
    name: string;
    value?: string;
}

export async function getDaysToBeNextToExp(): Promise<number> {
    try {
        const daysToBeNext = Realm.objects<ISetting>('Setting').filtered(
            "name = 'daysToBeNext'"
        )[0];

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
        Realm.write(() => {
            Realm.create(
                'Setting',
                {
                    name: 'daysToBeNext',
                    value: String(days),
                },
                true
            );
        });
    } catch (err) {
        console.warn(err);
    }
}

export async function setAppTheme(themeName: string): Promise<void> {
    try {
        Realm.write(() => {
            Realm.create(
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

export async function getAppTheme(): Promise<string> {
    try {
        const appTheme = Realm.objects<ISetting>('Setting').filtered(
            "name = 'appTheme'"
        )[0];

        if (appTheme.value) {
            return appTheme.value;
        }

        await setAppTheme('system');
        return 'system';
    } catch (err) {
        throw new Error(err);
    }
}

export async function getNotificationsEnabled(): Promise<boolean> {
    const isEnabled = await AsyncStorange.getItem(
        '@ControleDeValidade/NotificationsEnabled'
    );

    if (!isEnabled) {
        return true;
    }
    if (isEnabled === 'false') {
        return false;
    }

    return true;
}

export async function setNotificationsEnabled(
    isEnabled: boolean
): Promise<void> {
    try {
        await AsyncStorange.setItem(
            '@ControleDeValidade/NotificationsEnabled',
            String(isEnabled)
        );
    } catch (err) {
        throw new Error(
            `Falha ao salvar as configurações de notificações. ${err.message}`
        );
    }
}

export async function setMultipleStores(enabled: boolean): Promise<void> {
    try {
        await AsyncStorange.setItem(
            '@ControleDeValidade/MultipleStores',
            String(enabled)
        );
    } catch (err) {
        throw new Error(
            `Falha ao salvar as configurações de múltiplas lojas. ${err.message}`
        );
    }
}

export async function getMultipleStores(): Promise<boolean> {
    const isEnabled = await AsyncStorange.getItem(
        '@ControleDeValidade/MultipleStores'
    );

    if (!isEnabled) {
        return false;
    }
    if (isEnabled === 'true') {
        return true;
    }

    return false;
}

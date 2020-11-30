import AsyncStorange from '@react-native-community/async-storage';

import { Setting } from '../Models/Setting';

import { getConnection } from '../Services/TypeORM';
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

/* TYPEORM */
interface ISetSettingProps {
    type:
        | 'HowManyDaysToBeNextExp'
        | 'AppTheme'
        | 'EnableNotifications'
        | 'EnableMultipleStores';
    value: string;
}

async function setSetting({ type, value }: ISetSettingProps): Promise<void> {
    const connection = await getConnection();
    try {
        const setting = new Setting();

        setting.name = type;
        setting.value = value;

        const settingRepository = connection.getRepository(Setting);

        const findExistintSetting = await settingRepository.findOne({
            where: {
                value: '123',
            },
        });

        // if (findExistintSetting.length <= 0) {
        //     await settingRepository.save(setting);
        //     return;
        // }

        // console.log(findExistintSetting);

        // findExistintSetting[0].value = value;
        // await settingRepository.save(findExistintSetting[0]);
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}

export async function setHowManyDaysToBeNextExp(
    howManyDays: number
): Promise<void> {
    await setSetting({
        type: 'HowManyDaysToBeNextExp',
        value: String(howManyDays),
    });
}

export async function setAppTheme(themeName: string): Promise<void> {
    await setSetting({
        type: 'AppTheme',
        value: themeName,
    });
}

export async function setEnableNotifications(enable: boolean): Promise<void> {
    await setSetting({
        type: 'EnableNotifications',
        value: String(enable),
    });
}

export async function setEnableMultipleStoresMode(
    enable: boolean
): Promise<void> {
    await setSetting({
        type: 'EnableMultipleStores',
        value: String(enable),
    });
}

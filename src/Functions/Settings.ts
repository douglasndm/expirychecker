import { Setting } from '../Models/Setting';

import { getConnection } from '../Services/TypeORM';

/* TYPEORM */
interface ISetSettingProps {
    type:
        | 'HowManyDaysToBeNextExp'
        | 'AppTheme'
        | 'EnableNotifications'
        | 'EnableMultipleStores'
        | 'EnableProVersion';
    value: string;
}

async function setSetting({ type, value }: ISetSettingProps): Promise<void> {
    const connection = await getConnection();

    try {
        const setting = new Setting();

        setting.name = type;
        setting.value = value;

        const settingRepository = connection.getRepository(Setting);

        // check if the setting exist for update it and not create again
        const findExistintSetting = await settingRepository.findOne({
            where: {
                name: type,
            },
        });

        if (!findExistintSetting) {
            await settingRepository.save(setting);
            return;
        }

        // need to set here after find an existent setting for updating it and not create again
        findExistintSetting.value = value;
        await settingRepository.save(findExistintSetting);
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

export async function setEnableProVersion(enable: boolean): Promise<void> {
    await setSetting({
        type: 'EnableProVersion',
        value: String(enable),
    });
}

async function getSetting({
    type,
}: Omit<ISetSettingProps, 'value'>): Promise<Setting> {
    const connection = await getConnection();

    try {
        const settingRepository = connection.getRepository(Setting);

        const setting = await settingRepository.findOne({
            where: {
                name: type,
            },
        });

        if (!setting) {
            throw new Error(`Configuração não encontrada. ${type}`);
        }

        return setting;
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}

export async function getHowManyDaysToBeNextExp(): Promise<number> {
    const setting = await getSetting({ type: 'HowManyDaysToBeNextExp' });

    return Number(setting.value);
}

export async function getAppTheme(): Promise<string> {
    const setting = await getSetting({ type: 'AppTheme' });

    return setting.value;
}

export async function getEnableNotifications(): Promise<boolean> {
    const setting = await getSetting({ type: 'EnableNotifications' });

    return Boolean(setting.value);
}

export async function getEnableMultipleStoresMode(): Promise<boolean> {
    const setting = await getSetting({ type: 'EnableMultipleStores' });

    return Boolean(setting.value);
}

export async function getEnableProVersion(): Promise<boolean> {
    const setting = await getSetting({ type: 'EnableProVersion' });

    if (setting.value === 'true') {
        return true;
    }
    return false;
}

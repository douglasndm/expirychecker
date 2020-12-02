import AsyncStorage from '@react-native-community/async-storage';
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
    try {
        await AsyncStorage.setItem(type, value);
    } catch (err) {
        throw new Error(err);
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
}: Omit<ISetSettingProps, 'value'>): Promise<string> {
    try {
        const setting = await AsyncStorage.getItem(type);

        if (!setting) {
            throw new Error('Configuração não encontrada');
        }

        return setting;
    } catch (err) {
        throw new Error(err);
    }
}

export async function getHowManyDaysToBeNextExp(): Promise<number> {
    const setting = await getSetting({ type: 'HowManyDaysToBeNextExp' });

    return Number(setting);
}

export async function getAppTheme(): Promise<string> {
    const setting = await getSetting({ type: 'AppTheme' });

    return setting;
}

export async function getEnableNotifications(): Promise<boolean> {
    const setting = await getSetting({ type: 'EnableNotifications' });

    if (setting === 'true') return true;
    return false;
}

export async function getEnableMultipleStoresMode(): Promise<boolean> {
    const setting = await getSetting({ type: 'EnableMultipleStores' });

    if (setting === 'true') return true;
    return false;
}

export async function getEnableProVersion(): Promise<boolean> {
    const setting = await getSetting({ type: 'EnableProVersion' });

    if (setting === 'true') {
        return true;
    }
    return false;
}

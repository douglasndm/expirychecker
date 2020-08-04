import { Appearance } from 'react-native';
import Light from './Light';
import Dark from './Dark';
import UltraViolet from './UltraViolet';

import { getAppTheme } from '../Functions/Settings';

export default {
    Light,
    Dark,
    UltraViolet,
};

export async function getActualAppTheme() {
    const theme = await getAppTheme();
    const systemTheme = Appearance.getColorScheme();

    if (theme === 'light') {
        return Light;
    }
    if (theme === 'dark') {
        return Dark;
    }
    if (theme === 'ultraviolet') {
        return UltraViolet;
    }
    if (theme === 'system') {
        if (systemTheme === 'light') {
            return Light;
        }
        if (systemTheme === 'dark') {
            return Dark;
        }
    }
    return Light;
}

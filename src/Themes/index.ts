import { Appearance } from 'react-native';

import Light from './Light';
import Dark from './Dark';
import UltraViolet from './UltraViolet';
import DarkGreen from './DarkGreen';
import HappyPink from './HappyPink';
import OceanBlue from './OceanBlue';

import { getAppTheme } from '../Functions/Settings';

export default {
    Light,
    Dark,
    UltraViolet,
    DarkGreen,
    HappyPink,
    OceanBlue,
};

export const getActualAppTheme = async (): Promise<ITheme> => {
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
    if (theme === 'darkgreen') {
        return DarkGreen;
    }
    if (theme === 'happypink') {
        return HappyPink;
    }
    if (theme === 'oceanblue') {
        return OceanBlue;
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
};

import React, {
    useState,
    useCallback,
    useContext,
    useMemo,
    useEffect,
} from 'react';

import strings from '~/Locales';

import { getActualAppTheme, Themes } from '@shared/Themes';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { setAppTheme, getAppTheme } from '~/Functions/Themes';

import { Category, CategoryOptions, CategoryTitle, Picker } from '../../styles';
import { Text, PickerContainer } from './styles';

interface IThemeItem {
    label: string;
    value: string;
    key: string;
}

const Appearance: React.FC = () => {
    const { userPreferences, setUserPreferences } =
        useContext(PreferencesContext);

    const [selectedTheme, setSelectedTheme] = useState<string>('system');

    const data = useMemo(() => {
        const availableThemes: Array<IThemeItem> = [];

        availableThemes.push({
            label: strings.View_Settings_Appearance_Theme_System,
            value: 'system',
            key: 'system',
        });

        if (userPreferences.isPRO) {
            Themes.forEach(theme => {
                availableThemes.push({
                    label: theme.name,
                    key: theme.key,
                    value: theme.key,
                });
            });
        } else {
            Themes.forEach(theme => {
                if (!theme.isPro) {
                    availableThemes.push({
                        label: theme.name,
                        key: theme.key,
                        value: theme.key,
                    });
                }
            });
        }

        return availableThemes;
    }, [userPreferences.isPRO]);

    useEffect(() => {
        getAppTheme().then(response => setSelectedTheme(response));
    }, []);

    const handleThemeChange = useCallback(
        async (themeName: string) => {
            if (themeName === 'null') {
                return;
            }
            setSelectedTheme(themeName);
            await setAppTheme(themeName);

            const changeToTheme = await getActualAppTheme();

            setUserPreferences({
                ...userPreferences,
                appTheme: changeToTheme,
            });
        },
        [setUserPreferences, userPreferences]
    );

    return (
        <Category>
            <CategoryTitle>
                {strings.View_Settings_CategoryName_Appearance}
            </CategoryTitle>

            <CategoryOptions>
                <Text>{strings.View_Settings_SettingName_AppTheme}</Text>
                <PickerContainer>
                    <Picker
                        items={data}
                        onValueChange={handleThemeChange}
                        value={selectedTheme}
                        placeholder={{
                            label: strings.View_Settings_Appearance_Theme_SelectOne,
                            value: 'null',
                        }}
                    />
                </PickerContainer>
            </CategoryOptions>
        </Category>
    );
};

export default Appearance;

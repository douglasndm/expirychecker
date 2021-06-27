import React, { useCallback, useContext } from 'react';
import { PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import strings from '../../Locales';

import PreferencesContext from '../../Contexts/PreferencesContext';

import StatusBar from '../StatusBar';

import { HeaderContainer, TextLogo, MenuIcon, MenuButton } from './styles';

interface RequestProps {
    title?: string;
}

const Header: React.FC<RequestProps> = ({ title }: RequestProps) => {
    const navigation = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const titleFontSize = PixelRatio.get() < 1.5 ? 19 : 26;

    const handleOpenMenu = useCallback(() => {
        navigation.toggleDrawer();
    }, [navigation]);

    return (
        <>
            <StatusBar forceWhiteTextIOS />

            <HeaderContainer>
                <MenuButton onPress={handleOpenMenu}>
                    <MenuIcon />
                </MenuButton>

                {title ? (
                    <TextLogo style={{ fontSize: titleFontSize }}>
                        {title}
                    </TextLogo>
                ) : (
                    <TextLogo style={{ fontSize: titleFontSize }}>
                        {userPreferences.isUserPremium
                            ? strings.AppName_ProVersion
                            : strings.AppName}
                    </TextLogo>
                )}
            </HeaderContainer>
        </>
    );
};

export default Header;

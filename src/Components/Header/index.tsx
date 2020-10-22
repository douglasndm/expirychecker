import React, { useContext } from 'react';
import { PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import PreferencesContext from '../../Contexts/PreferencesContext';

import { HeaderContainer, TextLogo, Icons, Button } from './styles';

interface RequestProps {
    title?: string;
}

const Header: React.FC<RequestProps> = ({ title }: RequestProps) => {
    const navigation = useNavigation();

    const { isUserPremium } = useContext(PreferencesContext);

    const titleFontSize = PixelRatio.get() < 1.5 ? 19 : 26;

    return (
        <HeaderContainer>
            <Button
                color="transparent"
                icon={() => (
                    <Icons name="menu-outline" size={33} color="white" />
                )}
                compact
                accessibilityLabel="Botão para abrir o menu"
                onPress={() => navigation.toggleDrawer()}
            />

            {title ? (
                <TextLogo style={{ fontSize: titleFontSize }}>{title}</TextLogo>
            ) : (
                <TextLogo style={{ fontSize: titleFontSize }}>
                    {isUserPremium ? 'Premium' : 'Controle de validade'}
                </TextLogo>
            )}
        </HeaderContainer>
    );
};

export default Header;

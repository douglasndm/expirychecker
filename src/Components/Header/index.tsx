import React, { useCallback, useContext } from 'react';
import { PixelRatio, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import StatusBar from '../StatusBar';
import BackButton from '../BackButton';

import {
    HeaderContainerNoDrawner,
    HeaderContainer,
    TextLogo,
    MenuIcon,
    MenuButton,
} from './styles';

interface RequestProps {
    title?: string;
    noDrawer?: boolean;
    onBackPressed?: () => void;
    listRef?: React.RefObject<FlatList<IProduct>>;
}

const Header: React.FC<RequestProps> = ({
    title,
    noDrawer,
    onBackPressed,
    listRef,
}: RequestProps) => {
    const navigation = useNavigation<DrawerNavigationProp<RoutesParams>>();

    const { userPreferences } = useContext(PreferencesContext);

    const titleFontSize = PixelRatio.get() < 1.5 ? 19 : 26;

    const handleOpenMenu = useCallback(() => {
        navigation.toggleDrawer();
    }, [navigation]);

    const handleGoBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }, [navigation]);

    let lastPress = 0;

    const onDoublePress = useCallback(() => {
        const time = new Date().getTime();
        const delta = time - lastPress;

        const DOUBLE_PRESS_DELAY = 400;
        if (delta < DOUBLE_PRESS_DELAY) {
            // Success double press

            if (listRef && listRef.current) {
                if (listRef.current.props.data?.length)
                    listRef.current.scrollToIndex({
                        animated: true,
                        index: 0,
                    });
            }
        }
        lastPress = time;
    }, []);

    return noDrawer ? (
        <HeaderContainerNoDrawner>
            <BackButton handleOnPress={onBackPressed || handleGoBack} />

            <TextLogo noDrawer={noDrawer}>{title}</TextLogo>
        </HeaderContainerNoDrawner>
    ) : (
        <>
            <StatusBar forceWhiteTextIOS />

            <HeaderContainer onPress={onDoublePress}>
                <>
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
                </>
            </HeaderContainer>
        </>
    );
};

export default Header;

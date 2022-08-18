import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Animated, Easing, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from '@react-native-community/blur';
import remoteConfig from '@react-native-firebase/remote-config';

import { Container, IconContainer, Icon, MainIcon, IconRound } from './styles';

interface Props {
    currentRoute: string;
}

const TabMenu: React.FC<Props> = ({ currentRoute }: Props) => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const enableBlur = remoteConfig().getValue('enable_app_bar_blur');

    const positionY = useState(new Animated.Value(0))[0];

    const showBar = useCallback(() => {
        Animated.timing(positionY, {
            toValue: 0,
            duration: 500,
            easing: Easing.elastic(1),
            useNativeDriver: true,
        }).start();
    }, [positionY]);

    const hideBar = useCallback(() => {
        Animated.timing(positionY, {
            toValue: 120,
            duration: 350,
            easing: Easing.back(1),
            useNativeDriver: true,
        }).start();
    }, [positionY]);

    useEffect(() => {
        switch (currentRoute) {
            case 'Home':
                showBar();
                break;
            case 'ListCategory':
                showBar();
                break;
            case 'BrandList':
                showBar();
                break;
            case 'StoreList':
                showBar();
                break;
            case 'AllProducts':
                showBar();
                break;
            case 'AddProduct':
                hideBar();
                break;
            default:
                hideBar();
                break;
        }
    }, [currentRoute, hideBar, showBar]);

    const handlePress = useCallback(
        (button_name: string) => {
            switch (button_name) {
                case 'Category':
                    navigate('ListCategory');
                    break;
                case 'AddProduct':
                    navigate('AddProduct', {});
                    break;
                case 'Brands':
                    navigate('BrandList');
                    break;
                case 'Stores':
                    navigate('StoreList');
                    break;
                default:
                    navigate('Home');
                    break;
            }
        },
        [navigate]
    );
    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        absolute: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        },
    });

    return (
        <Container
            style={{
                transform: [{ translateX: 0 }, { translateY: positionY }],
            }}
            disableTransparency={!enableBlur.asBoolean() === true}
        >
            {enableBlur.asBoolean() === true && (
                <BlurView
                    style={styles.absolute}
                    blurType="light"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white"
                />
            )}

            <IconContainer onPress={() => handlePress('Home')}>
                {currentRoute === 'Home' ? (
                    <Icon name="home" isSelected />
                ) : (
                    <Icon name="home-outline" isSelected={false} />
                )}
            </IconContainer>
            <IconContainer onPress={() => handlePress('Category')}>
                {currentRoute === 'ListCategory' ? (
                    <Icon name="file-tray-full" isSelected />
                ) : (
                    <Icon name="file-tray-full-outline" isSelected={false} />
                )}
            </IconContainer>

            <IconContainer
                style={{ bottom: Platform.OS === 'ios' ? 10 : -10 }}
                onPress={() => handlePress('AddProduct')}
            >
                <IconRound>
                    <MainIcon name="add" />
                </IconRound>
            </IconContainer>

            <IconContainer onPress={() => handlePress('Brands')}>
                {currentRoute === 'BrandList' ? (
                    <Icon name="ribbon" isSelected />
                ) : (
                    <Icon name="ribbon-outline" isSelected={false} />
                )}
            </IconContainer>
            <IconContainer onPress={() => handlePress('Stores')}>
                {currentRoute === 'StoreList' ? (
                    <Icon name="list" isSelected />
                ) : (
                    <Icon name="list-outline" isSelected={false} />
                )}
            </IconContainer>
        </Container>
    );
};

export default TabMenu;

import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from '@react-native-community/blur';

import { Container, IconContainer, Icon, MainIcon, IconRound } from './styles';

const TabMenu: React.FC = () => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();
    const [selectedButton, setSelectedButton] = useState('Home');

    const handlePress = useCallback(
        (button_name: string) => {
            switch (button_name) {
                case 'Category':
                    setSelectedButton('Category');
                    navigate('ListCategory');
                    break;
                case 'AddProduct':
                    setSelectedButton('AddProduct');
                    navigate('AddProduct', {});
                    break;
                case 'Brands':
                    setSelectedButton('Brands');
                    navigate('BrandList');
                    break;
                case 'Stores':
                    setSelectedButton('Stores');
                    navigate('StoreList');
                    break;
                default:
                    setSelectedButton('Home');
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
        <Container>
            <BlurView
                style={styles.absolute}
                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
            />
            <IconContainer onPress={() => handlePress('Home')}>
                {selectedButton === 'Home' ? (
                    <Icon name="home" isSelected />
                ) : (
                    <Icon name="home-outline" isSelected={false} />
                )}
            </IconContainer>
            <IconContainer onPress={() => handlePress('Category')}>
                {selectedButton === 'Category' ? (
                    <Icon name="file-tray-full" isSelected />
                ) : (
                    <Icon name="file-tray-full-outline" isSelected={false} />
                )}
            </IconContainer>

            <IconContainer
                style={{ bottom: 10 }}
                onPress={() => handlePress('AddProduct')}
            >
                <IconRound>
                    <MainIcon name="add" />
                </IconRound>
            </IconContainer>

            <IconContainer onPress={() => handlePress('Brands')}>
                {selectedButton === 'Brands' ? (
                    <Icon name="ribbon" isSelected />
                ) : (
                    <Icon name="ribbon-outline" isSelected={false} />
                )}
            </IconContainer>
            <IconContainer onPress={() => handlePress('Stores')}>
                {selectedButton === 'Stores' ? (
                    <Icon name="list" isSelected />
                ) : (
                    <Icon name="list-outline" isSelected={false} />
                )}
            </IconContainer>
        </Container>
    );
};

export default TabMenu;

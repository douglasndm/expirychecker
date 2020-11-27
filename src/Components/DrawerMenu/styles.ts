import styled from 'styled-components/native';
import { DrawerItem } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const MenuHeader = styled.View`
    background-color: ${({ theme }) => theme.colors.accent};
    padding: 25px;
    margin-top: -5px;
`;

export const MenuHeaderTitle = styled.Text`
    font-size: 36px;
    color: #fff;
`;

export const LogoImage = styled.Image`
    width: 90%;
    height: 65px;
`;

export const MenuItem = styled(DrawerItem).attrs((props) => ({
    labelStyle: {
        color: props.theme.colors.text,
    },
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

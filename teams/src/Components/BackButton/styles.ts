import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const BackButtonComponent = styled(RectButton)``;

export const BackButtonImage = styled(Ionicons).attrs((props) => ({
    name: 'arrow-back-outline',
    color: props.theme.colors.text,
    size: 28,
}))``;

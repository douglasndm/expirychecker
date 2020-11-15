import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const BackButtonPaper = styled(Button).attrs((props) => ({
    compact: true,
    color: props.theme.colors.accent,
}))``;

export const BackButtonImage = styled(Ionicons).attrs((props) => ({
    name: 'arrow-back-outline',
    color: props.theme.colors.text,
    size: 28,
}))``;

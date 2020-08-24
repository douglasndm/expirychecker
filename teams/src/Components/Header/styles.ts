import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button as ButtonPaper } from 'react-native-paper';

export const HeaderContainer = styled.View`
    width: 100%;
    padding: 15px 30px 15px 0px;

    justify-content: flex-start;
    align-items: center;

    background-color: ${(props) => props.theme.colors.accent};

    flex-direction: row;
`;

export const TextLogo = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: white;
`;

export const Icons = styled(Ionicons)``;

export const Button = styled(ButtonPaper)``;

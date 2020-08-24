import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RNCamera } from 'react-native-camera';

export const Camera = styled(RNCamera)`
    align-self: center;

    margin-top: 10px;
    margin-bottom: 10px;

    width: 100%;
    height: 25%;

    z-index: -1;
`;

export const ButtonPaper = styled(Button)``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

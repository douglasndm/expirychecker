import styled, { css } from 'styled-components/native';
import { RNCamera } from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const CameraContainer = styled.View`
    flex: 1;
`;

export const PreviewContainer = styled.View`
    align-items: center;
    justify-content: center;
    flex: 1;
`;

export const PicPreview = styled.Image`
    width: 85%;
    height: 90%;
    border-radius: 42px;
`;

export const CameraComponent = styled(RNCamera).attrs(() => ({
    captureAudio: false,
}))`
    flex: 1;
    background: #9159c1;
`;

export const ButtonsContainer = styled.View`
    flex-direction: row;
    justify-content: center;

    margin: 5px;
    margin-bottom: 20px;
`;

export const ShotButtonContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    background: ${props => props.theme.colors.accent};
    border-radius: 12px;
`;

interface IconsProps {
    isSelected?: boolean;
}

export const Icons = styled(Ionicons).attrs(props => ({
    size: 34,
    color: props.isSelected ? props.theme.colors.inputText : '#fff',
}))<IconsProps>`
    padding: 10px 30px;

    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    ${props =>
        props.isSelected &&
        css`
            background: white;
        `}
`;

export const IconNoBackground = styled(Ionicons).attrs(() => ({
    size: 34,
}))`
    padding: 10px 30px;

    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;

    background: #fff;
    color: #000;
`;

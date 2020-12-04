import styled from 'styled-components/native';
import { RNCamera } from 'react-native-camera';

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
`;

export const BarCodeTitle = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 28px;
    margin: 10px;
`;

export const CameraContainer = styled.View`
    justify-content: center;
    flex: 1;
`;

export const Camera = styled(RNCamera)`
    flex: 1;
    align-self: center;

    margin-top: 50px;
    margin-bottom: 10px;

    width: 100%;
    height: 5%;
`;

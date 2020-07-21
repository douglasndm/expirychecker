import styled from 'styled-components/native';
import { RNCamera } from 'react-native-camera';

export const Camera = styled(RNCamera)`
    align-self: center;

    margin-top: 10px;
    margin-bottom: 10px;

    width: 100%;
    height: 25%;

    z-index: -1;
`;

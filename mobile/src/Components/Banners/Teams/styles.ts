import styled from 'styled-components/native';

import { RectButton } from 'react-native-gesture-handler';

export const TeamsContainer = styled(RectButton)`
    background-color: #5856d6;
    padding: 15px 10px;
    border-radius: 12px;
    margin: 5px 10px;
`;

export const TeamsText = styled.Text`
    color: #fff;
    font-size: 13px;
    font-family: 'Open Sans';
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
`;

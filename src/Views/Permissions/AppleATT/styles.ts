import styled, { css } from 'styled-components/native';
import { isIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.SafeAreaView`
    flex: 1;
    padding: 15px 10px;

    ${isIphoneX() &&
    css`
        padding-top: ${getStatusBarHeight() + 15}px;
    `}
`;

export const Content = styled.View`
    margin: 0 15px;
`;

export const PageTitle = styled.Text`
    font-family: 'Open Sans';
    font-weight: bold;
    font-size: 25px;
`;

export const Message = styled.Text`
    font-family: 'Open Sans';
    font-weight: 300;

    margin: 15px 0;
`;

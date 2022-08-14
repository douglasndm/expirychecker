import { Animated, Dimensions } from 'react-native';
import styled, { css } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { darken, opacify } from 'polished';

interface Props {
    disableTransparency?: boolean;
}

export const Container = styled(Animated.View)<Props>`
    background-color: ${({ theme }) => theme.colors.TabBackground};
    position: absolute;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding-bottom: ${Dimensions.get('window').height > 600 ? '15px' : '5px'};
    bottom: 0;

    ${props =>
        props.disableTransparency &&
        css`
            background-color: ${({ theme }) =>
                opacify(1, theme.colors.TabBackground)};
        `}
`;

export const IconContainer = styled.Pressable`
    justify-content: center;
    align-items: center;
    flex: 1;
`;

interface Props {
    isSelected?: boolean;
}

export const Icon = styled(Ionicons).attrs(() => ({
    size: Dimensions.get('window').height > 600 ? 28 : 22,
}))<Props>`
    ${props =>
        props.isSelected
            ? css`
                  color: ${({ theme }) => theme.colors.TabTextSelected};
              `
            : css`
                  color: ${({ theme }) => theme.colors.TabText};
              `}
`;

export const MainIcon = styled(Ionicons).attrs(() => ({
    size: Dimensions.get('window').height > 600 ? 30 : 20,
    color: '#fff',
}))``;

export const IconRound = styled(LinearGradient).attrs(({ theme }) => ({
    start: { x: 0, y: 1 },
    end: { x: 0, y: 0 },
    colors: [theme.colors.accent, darken(0.15, theme.colors.accent)],
}))`
    width: ${Dimensions.get('window').height > 600 ? '60px' : '40px'};
    height: ${Dimensions.get('window').height > 600 ? '60px' : '40px'};
    border-radius: 30px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: center;
    elevation: 2;
    flex-direction: row;
`;

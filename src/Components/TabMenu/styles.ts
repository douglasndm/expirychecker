import styled, { css } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { darken } from 'polished';

export const Container = styled.View`
    background-color: ${({ theme }) => theme.colors.TabBackground};
    position: absolute;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding-bottom: 15px;
    bottom: 0;
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
    size: 28,
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
    size: 30,
    color: '#fff',
}))``;

export const IconRound = styled(LinearGradient).attrs(({ theme }) => ({
    start: { x: 0, y: 1 },
    end: { x: 0, y: 0 },
    colors: [theme.colors.accent, darken(0.15, theme.colors.accent)],
}))`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: center;
    elevation: 6;
    flex-direction: row;
`;

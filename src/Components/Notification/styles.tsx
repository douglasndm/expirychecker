import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

interface NotificationProps {
    NotificationType?: 'normal' | 'error';
}

export const Container = styled(RectButton)<NotificationProps>`
    position: absolute;
    bottom: 75px;

    width: 350px;
    height: 75px;

    align-self: center;
    border-radius: 10px;

    background: ${({ theme }) => theme.colors.accent};

    ${(props) =>
        props.NotificationType === 'error' &&
        css`
            background: #c41826;
        `}
`;

export const Title = styled.Text`
    font-size: 19px;
    font-weight: bold;
    margin: 5px 10px 0;

    color: #fff;
`;

export const Description = styled.Text`
    margin: 0 10px;

    color: #fff;
`;

import React from 'react';

import { Container, Title, Description } from './styles';

interface NotificationProps {
    NotificationMessage: string;
    NotificationType?: 'normal' | 'error';
    onPress: () => void;
}

const Notification: React.FC<NotificationProps> = ({
    NotificationMessage,
    NotificationType = 'normal',
    onPress,
}: NotificationProps) => {
    return (
        <Container NotificationType={NotificationType} onPress={onPress}>
            <Title>
                {NotificationType === 'error' ? 'Erro' : 'Notificação'} | Toque
                para fechar
            </Title>
            <Description>{NotificationMessage}</Description>
        </Container>
    );
};

export default Notification;

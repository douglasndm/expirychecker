import React, { useState } from 'react';

import { SnackBar } from './styles';

interface NotificationProps {
    NotificationMessage: string;
    NotificationType?: 'normal' | 'error';
}

const Notification: React.FC<NotificationProps> = ({
    NotificationMessage,
    NotificationType = 'normal',
}: NotificationProps) => {
    const [snackBarVisible, setSnackBarVisible] = useState(true);

    return (
        <SnackBar
            visible={snackBarVisible}
            duration={7000}
            onDismiss={() => setSnackBarVisible(false)}
            NotificationType={NotificationType}
            // action={{
            //     label: 'fechar',
            //     accessibilityLabel: 'Fechar notificação',
            //     onPress: () => {
            //         setSnackBarVisible(false);
            //     },
            // }}
        >
            {NotificationMessage}
        </SnackBar>
    );
};

export default Notification;

import React, { useState, useCallback, useEffect } from 'react';
import { Linking } from 'react-native';
import { checkNotifications } from 'react-native-permissions';

import { Container, Text, EmptyHack } from './styles';

const NotificationsDenny: React.FC = () => {
    const [showAlert, setShowAlert] = useState(false);

    const check = useCallback(async () => {
        const isAllow = await checkNotifications();

        if (isAllow.status === 'denied' || isAllow.status === 'blocked') {
            setShowAlert(true);
        } else setShowAlert(false);
    }, []);

    const handleOpenSettings = useCallback(async () => {
        await Linking.openSettings();
    }, []);

    useEffect(() => {
        check();
    }, []);

    return showAlert ? (
        <Container onPress={handleOpenSettings}>
            <Text>
                As notificações estão bloqueadas para o aplicativo. Desbloqueie
                nas configurações do telefone para garantir lembrentes de
                vencimentos
            </Text>
        </Container>
    ) : (
        <EmptyHack />
    );
};

export default NotificationsDenny;

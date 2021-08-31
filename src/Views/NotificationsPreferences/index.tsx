import React from 'react';

import Header from '~/Components/Header';

import Phone from './Phone';

import { Container, Content } from './styles';

const NotificationsPreferences: React.FC = () => {
    return (
        <Container>
            <Header title="Notificações" noDrawer />

            <Content>
                <Phone />
            </Content>
        </Container>
    );
};

export default NotificationsPreferences;

import React from 'react';

import StatusBar from '@shared/Components/StatusBar';

import strings from '~/Locales';

import { Container, LoadingIndicator, LoadingText } from './styles';

const Loading: React.FC = () => {
    return (
        <Container>
            <StatusBar />
            <LoadingIndicator />
            <LoadingText>{strings.LoadingComponent_Text}</LoadingText>
        </Container>
    );
};

export default Loading;

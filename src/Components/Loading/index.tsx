import React from 'react';

import { Container, LoadingIndicator, LoadingText } from './styles';

const Loading: React.FC = () => {
    return (
        <Container>
            <LoadingIndicator />
            <LoadingText>Carregando...</LoadingText>
        </Container>
    );
};

export default Loading;

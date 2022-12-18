import React from 'react';

import strings from '~/Locales';

import StatusBar from '@components/StatusBar';

import { Container, LoadingIndicator, LoadingText } from './styles';

interface Props {
    disableText?: boolean;
}

const Loading: React.FC<Props> = ({ disableText }: Props) => {
    return (
        <Container>
            <StatusBar />
            <LoadingIndicator />
            {!disableText && (
                <LoadingText>{strings.LoadingComponent_Text}</LoadingText>
            )}
        </Container>
    );
};

export default Loading;

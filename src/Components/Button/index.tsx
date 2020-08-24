import React from 'react';

import { Button, ButtonText } from './styles';

interface Request {
    text: string;
    accessibilityLabel?: string;
    onPress: () => void;
}

const GenericButton: React.FC<Request> = ({
    text,
    accessibilityLabel = '',
    onPress,
}: Request) => (
    <Button onPress={onPress} accessibilityLabel={accessibilityLabel}>
        <ButtonText>{text}</ButtonText>
    </Button>
);

export default GenericButton;

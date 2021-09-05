import React, { useMemo } from 'react';

import { ViewStyle } from 'react-native';

import { Button, ButtonText, Loading } from './styles';

interface Request {
    text: string;
    isLoading?: boolean;
    enable?: boolean;
    onPress: () => void;
    contentStyle?: ViewStyle;
}

const GenericButton: React.FC<Request> = ({
    text,
    isLoading = false,
    enable = true,
    onPress,
    contentStyle,
}: Request) => {
    const enabledButton = useMemo(() => {
        if (isLoading) {
            return false;
        }

        if (!enable) {
            return false;
        }

        return true;
    }, [enable, isLoading]);

    return (
        <Button onPress={onPress} enabled={enabledButton} style={contentStyle}>
            {isLoading ? <Loading /> : <ButtonText>{text}</ButtonText>}
        </Button>
    );
};

export default GenericButton;

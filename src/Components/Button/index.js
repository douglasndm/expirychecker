import React from 'react';
import { useTheme } from 'react-native-paper';

import { Button as Btn, ButtonText } from './styles';

const Button = ({ text, onPress }) => {
    const theme = useTheme();

    return (
        <Btn style={{ backgroundColor: theme.colors.accent }} onPress={onPress}>
            <ButtonText>{text}</ButtonText>
        </Btn>
    );
};

export default Button;

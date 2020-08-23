import React from 'react';

import { Button as Btn, ButtonText } from './styles';

interface Request {
    text: string;
    onPress: () => void;
}

const Button = ({ text, onPress }: Request) => {
    return (
        <Btn onPress={onPress}>
            <ButtonText>{text}</ButtonText>
        </Btn>
    );
};

export default Button;

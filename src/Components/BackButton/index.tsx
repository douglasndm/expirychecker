import React from 'react';

import { ButtonContainer, BackButtonImage } from './styles';

interface RequestProps {
    handleOnPress?: () => void;
}

const BackButton: React.FC<RequestProps> = ({
    handleOnPress,
}: RequestProps) => {
    return (
        <ButtonContainer onPress={handleOnPress} rippleColor="red">
            <BackButtonImage />
        </ButtonContainer>
    );
};

export default BackButton;

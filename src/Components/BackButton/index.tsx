import React from 'react';

import { BackButtonComponent, BackButtonImage } from './styles';

interface RequestProps {
    handleOnPress?: () => void;
}

const BackButton: React.FC<RequestProps> = ({
    handleOnPress,
}: RequestProps) => {
    return (
        <BackButtonComponent>
            <BackButtonImage onPress={handleOnPress} />
        </BackButtonComponent>
    );
};

export default BackButton;

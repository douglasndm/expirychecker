import React from 'react';

import { BackButtonPaper, BackButtonImage } from './styles';

interface RequestProps {
    handleOnPress?: () => void;
}

const BackButton: React.FC<RequestProps> = ({
    handleOnPress,
}: RequestProps) => {
    return (
        <BackButtonPaper
            icon={() => <BackButtonImage />}
            onPress={handleOnPress}
        />
    );
};

export default BackButton;

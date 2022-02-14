import React, { useCallback, useState } from 'react';

import {
    Container,
    TextDescription,
    InputTextContainer,
    InputText,
} from './styles';

interface Props {
    onChange: (value: number) => void;
}

const DaysToBeNext: React.FC<Props> = ({ onChange }: Props) => {
    const [days, setDays] = useState<string | undefined>();

    const onTextChange = useCallback(
        (value: string) => {
            const regex = /^[0-9\b]+$/;

            if (value === '' || regex.test(value)) {
                setDays(value);
                onChange(Number(value));
            }
        },
        [onChange]
    );

    return (
        <>
            <TextDescription>
                Quantos dias do vencimento do produto o aplicativo deve
                considerar-lo como próximo a vencer?
            </TextDescription>
            <Container>
                <InputTextContainer>
                    <InputText
                        placeholder="Dias do vencimento"
                        value={days}
                        onChangeText={onTextChange}
                    />
                </InputTextContainer>
            </Container>
        </>
    );
};

export default DaysToBeNext;

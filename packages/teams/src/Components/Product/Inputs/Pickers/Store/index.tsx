import React, { useState, useCallback } from 'react';
import { ViewStyle } from 'react-native';

import { PickerContainer, Picker } from '../styles';

interface Props {
    stores: IPickerItem[];
    onChange: (value: string) => void;
    containerStyle?: ViewStyle;
    defaultValue?: string | null;
}

const Store: React.FC<Props> = ({
    stores,
    onChange,
    containerStyle,
    defaultValue,
}: Props) => {
    const [selectedStore, setSelectedStore] = useState<string | null>(() => {
        if (defaultValue && defaultValue !== '') {
            return defaultValue;
        }
        return null;
    });

    const handleOnChange = useCallback(
        value => {
            setSelectedStore(value);

            // call on change on parent to update value their
            onChange(value);
        },
        [onChange]
    );

    return (
        <PickerContainer style={containerStyle}>
            <Picker
                items={stores}
                onValueChange={handleOnChange}
                value={selectedStore}
                placeholder={{
                    label: 'Atribuir a uma loja',
                    value: null,
                }}
            />
        </PickerContainer>
    );
};

export default Store;

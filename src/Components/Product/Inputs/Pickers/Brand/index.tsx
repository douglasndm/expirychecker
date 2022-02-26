import React, { useState, useEffect, useCallback } from 'react';
import { ViewStyle } from 'react-native';

import strings from '~/Locales';

import { getAllBrands } from '~/Utils/Brands';

import { PickerContainer, Picker } from '../styles';

interface Props {
    onChange: (value: string) => void;
    containerStyle?: ViewStyle;
    defaultValue?: string | null;
}

const Brand: React.FC<Props> = ({
    onChange,
    containerStyle,
    defaultValue,
}: Props) => {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(() => {
        if (defaultValue && defaultValue !== '') {
            return defaultValue;
        }
        return null;
    });

    const [brands, setBrands] = useState<Array<IBrandItem>>([]);

    const handleOnChange = useCallback(
        value => {
            setSelectedBrand(value);

            // call on change on parent to update value their
            onChange(value);
        },
        [onChange]
    );

    const loadData = useCallback(async () => {
        const allBrands = await getAllBrands();
        const brandsArray: Array<IBrandItem> = [];

        allBrands.forEach(brand =>
            brandsArray.push({
                key: brand.id,
                label: brand.name,
                value: brand.id,
            })
        );
        setBrands(brandsArray);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    return (
        <PickerContainer style={containerStyle}>
            <Picker
                items={brands}
                onValueChange={handleOnChange}
                value={selectedBrand}
                placeholder={{
                    label: strings.View_AddProduct_InputPlaceholder_SelectBrand,
                    value: 'null',
                }}
            />
        </PickerContainer>
    );
};

export default Brand;

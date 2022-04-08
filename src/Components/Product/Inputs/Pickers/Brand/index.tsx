import React, { useState, useEffect, useCallback } from 'react';
import { ViewStyle } from 'react-native';

import strings from '~/Locales';

import { createBrand, getAllBrands } from '~/Utils/Brands';

import { PickerContainer, Picker } from '../styles';

interface Props {
    onChange: (value: string) => void;
    containerStyle?: ViewStyle;
    defaultValue?: string | null;
}

export interface IBrandPickerRef {
    onChange: (value: string) => void;
    containerStyle?: ViewStyle;
    defaultValue?: string | null;
}

const Brand = React.forwardRef<IBrandPickerRef>((props, ref) => {
    const { defaultValue, containerStyle, onChange } = props;

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

    const selectByName = useCallback(
        async (name: string) => {
            const brand = brands.find(
                b => b.label.trim().toLowerCase() === name.trim().toLowerCase()
            );

            if (!brand) {
                const createdBrand = await createBrand(name);

                await loadData();

                setSelectedBrand(createdBrand.id);
            } else if (brand) {
                setSelectedBrand(brand.key);
            }
        },
        [brands, loadData]
    );

    React.useImperativeHandle(ref, () => ({
        onChange,
        setSelectedBrand,
        selectByName,
    }));

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
});

export default Brand;

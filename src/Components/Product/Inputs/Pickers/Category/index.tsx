import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ViewStyle } from 'react-native';

import strings from '@shared/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { getAllCategories } from '@expirychecker/Utils/Categories/All';

import { PickerContainer, Picker } from '@components/Picker/styles';

interface Props {
	onChange: (value: string) => void;
	containerStyle?: ViewStyle;
	defaultValue?: string | null;
}

const CategorySelect: React.FC<Props> = ({
	onChange,
	containerStyle,
	defaultValue,
}: Props) => {
	const { userPreferences } = useContext(PreferencesContext);

	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		() => {
			if (defaultValue && defaultValue !== '') {
				return defaultValue;
			}
			return null;
		}
	);

	const [categories, setCategories] = useState<Array<ICategoryItem>>([]);

	const handleOnChange = useCallback(
		(value: string) => {
			setSelectedCategory(value);

			// call on change on parent to update value their
			onChange(value);
		},
		[onChange]
	);

	const loadData = useCallback(async () => {
		const allCategories = await getAllCategories();

		const categoriesArray: Array<ICategoryItem> = [];

		allCategories.forEach(cat =>
			categoriesArray.push({
				key: cat.id,
				label: cat.name,
				value: cat.id,
			})
		);
		setCategories(categoriesArray);
	}, []);

	useEffect(() => {
		loadData();
	}, []);

	return (
		<PickerContainer style={containerStyle}>
			<Picker
				items={categories}
				onValueChange={handleOnChange}
				value={selectedCategory}
				placeholder={{
					color: userPreferences.appTheme.colors.placeholderColor,
					label: strings.View_AddProduct_InputPlaceholder_SelectCategory,
					value: 'null',
				}}
			/>
		</PickerContainer>
	);
};

export default CategorySelect;

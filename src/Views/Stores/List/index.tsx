import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '@expirychecker/Locales';

import { captureException } from '@expirychecker/Services/ExceptionsHandler';

import { sortStores } from '@expirychecker/Utils/Stores/Sort';
import { createStore } from '@expirychecker/Functions/Stores';
import { getAllStores } from '@expirychecker/Utils/Stores/Find';

import Header from '@components/Header';
import PaddingComponent from '@components/PaddingComponent';

import {
	Container,
	InputContainer,
	InputTextContainer,
	InputText,
	Icons,
	LoadingIcon,
	InputTextTip,
	ListItemContainer,
	ListItemTitle,
	AddButtonContainer,
	AddNewItemContent,
	ListTitle,
	Content,
} from '@styles/Views/GenericListPage';

const ListView: React.FC = () => {
	const { navigate, addListener } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const [newStoreName, setNewStoreName] = useState<string | undefined>();
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [inputHasError, setInputHasError] = useState<boolean>(false);
	const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

	const [stores, setStores] = useState<Array<IStore>>([]);

	const handleOnTextChange = useCallback((value: string) => {
		setInputHasError(false);
		setInputErrorMessage('');
		setNewStoreName(value);
	}, []);

	const handleSaveStore = useCallback(async () => {
		try {
			if (!newStoreName) {
				setInputHasError(true);
				setInputErrorMessage(
					strings.View_Store_List_AddNewStore_Error_TextEmpty
				);
				return;
			}

			setIsAdding(true);

			const newStore = await createStore(newStoreName);

			const sorted = sortStores([...stores, newStore]);

			setStores(sorted);
			setNewStoreName('');
		} catch (err) {
			if (err instanceof Error) setInputErrorMessage(err.message);
		} finally {
			setIsAdding(false);
		}
	}, [newStoreName, stores]);

	const handleNavigateToStore = useCallback(
		(store: IStore | string) => {
			navigate('StoreDetails', {
				store,
			});
		},
		[navigate]
	);

	const loadData = useCallback(async () => {
		try {
			const sts = await getAllStores();

			const noStore: IStore = {
				id: '000',
				name: strings.View_Store_List_NoStore,
			};

			const sorted = sortStores(sts);

			setStores([...sorted, noStore]);
		} catch (err) {
			if (err instanceof Error) {
				captureException(err);
			}
		}
	}, []);

	useEffect(() => {
		const unsubscribe = addListener('focus', () => {
			loadData();
		});

		return unsubscribe;
	}, [addListener, loadData]);

	return (
		<Container>
			<Header title={strings.View_Store_List_PageTitle} />
			<Content>
				<AddNewItemContent>
					<InputContainer>
						<InputTextContainer hasError={inputHasError}>
							<InputText
								value={newStoreName}
								onChangeText={handleOnTextChange}
								placeholder={
									strings.View_Store_List_AddNewStore_Placeholder
								}
							/>
						</InputTextContainer>

						<AddButtonContainer
							onPress={handleSaveStore}
							enabled={!isAdding}
						>
							{isAdding ? (
								<LoadingIcon />
							) : (
								<Icons name="add-circle-outline" />
							)}
						</AddButtonContainer>
					</InputContainer>

					{!!inputErrorMessage && (
						<InputTextTip>{inputErrorMessage}</InputTextTip>
					)}
				</AddNewItemContent>

				<ListTitle>{strings.View_Store_List_PageTitle}</ListTitle>

				{stores.map(store => {
					let storeToNavigate: string | IStore;

					if (store.id) {
						storeToNavigate = store.id;
					} else if (!store.id && store.name) {
						storeToNavigate = store.name;
					} else {
						storeToNavigate = store;
					}

					return (
						<ListItemContainer
							key={store.id}
							onPress={() =>
								handleNavigateToStore(storeToNavigate)
							}
						>
							<ListItemTitle>{store.name}</ListItemTitle>
						</ListItemContainer>
					);
				})}

				<PaddingComponent />
			</Content>
		</Container>
	);
};

export default ListView;

import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { exists } from 'react-native-fs';

import Loading from '@components/Loading';
import BackButton from '@components/BackButton';
import Button from '@components/Button';
import { getProductImagePath } from '~/Functions/Products/Image';
import strings from '../../Locales';

import { Container, PageHeader, PageTitle, Image } from './styles';

interface Props {
	productId: number;
}

const PhotoView: React.FC<Props> = () => {
	const [photoPath, setPhotoPath] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { params } = useRoute();
	const routeParams = params as Props;

	const { goBack } = useNavigation<StackNavigationProp<RoutesParams>>();

	const loadData = useCallback(async () => {
		setIsLoading(true);
		const imagePath = await getProductImagePath(routeParams.productId);

		if (imagePath) {
			const fileExists = await exists(imagePath);
			if (fileExists) {
				setPhotoPath(`file://${imagePath}`);
			}
		}
		setIsLoading(false);
	}, [routeParams.productId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<Container>
					<PageHeader>
						<BackButton handleOnPress={goBack} />
						<PageTitle>
							{strings.View_PhotoView_PageTitle}
						</PageTitle>
					</PageHeader>

					{!!photoPath && <Image source={{ uri: photoPath }} />}
					<Button
						text={strings.View_PhotoView_Button_Back}
						onPress={goBack}
					/>
				</Container>
			)}
		</>
	);
};

export default PhotoView;

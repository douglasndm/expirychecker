import React, { useState, useCallback, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';

import { getProductImagePath } from '@expirychecker/Functions/Products/Image';

import Loading from '@components/Loading';

import PhotoViewer from '@views/Product/PhotoView';

interface Props {
	productId: number;
}

const PhotoView: React.FC<Props> = () => {
	const [photoPath, setPhotoPath] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { params } = useRoute();
	const routeParams = params as Props;

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			const imagePath = await getProductImagePath(routeParams.productId);

			if (imagePath) {
				setPhotoPath(imagePath);
			}
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.productId]);

	useEffect(() => {
		loadData();
	}, []);

	return isLoading ? <Loading /> : <PhotoViewer path={photoPath} />;
};

export default PhotoView;

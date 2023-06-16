import styled, { css } from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';

import LogoImg from '~/Assets/Logo.png';

export const Container = styled.Pressable``;

export const LogoImage = styled.Image.attrs(() => ({
	source: LogoImg,
	resizeMode: 'cover',
}))`
	width: 120px;
	height: 120px;

	${Dimensions.get('window').height > 920 &&
	Platform.OS === 'ios' &&
	css`
		margin-top: 50px;
	`}
`;

import styled from 'styled-components/native';
import { Text } from 'react-native';
import { AppleButton as BtnApple } from '@invertase/react-native-apple-authentication';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
	padding: 10px;
`;

export const LoginText = styled(Text)`
	color: ${props => props.theme.colors.text};
`;

export const ButtonsContainer = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;

export const AppleButton = styled(BtnApple).attrs(_ => ({
	buttonStyle: BtnApple.Style.WHITE,
	buttonType: BtnApple.Type.SIGN_IN,
}))`
	width: 250px;
	height: 65px;
`;

export const GoogleButton = styled(GoogleSigninButton).attrs(_ => ({
	size: GoogleSigninButton.Size.Wide,
	color: GoogleSigninButton.Color.Light,
}))`
	margin-top: 5px;
	width: 260px;
	height: 75px;
`;

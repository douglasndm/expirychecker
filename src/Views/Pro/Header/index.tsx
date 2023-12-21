import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';

import strings from '@expirychecker/Locales';

import Logo from '@components/Logo';

import {
	Container,
	HeaderContainer,
	ProLabelContainer,
	ProLabelText,
} from './styles';

const Header: React.FC = () => {
	const { goBack } = useNavigation();
	return (
		<Container>
			<SafeAreaView>
				<Appbar.BackAction color="#fff" onPress={goBack} />

				<HeaderContainer>
					<Logo width={180} height={180} />

					<ProLabelContainer>
						<ProLabelText>
							{strings.View_ProPage_ProLabel}
						</ProLabelText>
					</ProLabelContainer>
				</HeaderContainer>
			</SafeAreaView>
		</Container>
	);
};

export default Header;

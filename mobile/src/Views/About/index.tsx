import React, { useCallback } from 'react';
import { View, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BackButton from '../../Components/BackButton';

import {
    Container,
    Content,
    PageTitle,
    AboutSection,
    ApplicationName,
    Text,
    Link,
} from './styles';

const About: React.FC = () => {
    const { goBack } = useNavigation();

    const handleLinkedinPress = useCallback(async () => {
        await Linking.openURL('https://www.linkedin.com/in/douglasndm/');
    }, []);

    const handleFlatIconPress = useCallback(async () => {
        await Linking.openURL('https://www.flaticon.com/authors/srip');
    }, []);

    return (
        <Container>
            <Content>
                <BackButton handleOnPress={goBack} />
                <PageTitle>Sobre</PageTitle>
            </Content>

            <AboutSection>
                <ApplicationName>Controle de Validade</ApplicationName>
            </AboutSection>

            <AboutSection>
                <Text>Desenvolvido por Douglas Nunes de Mattos</Text>
                <Link onPress={handleLinkedinPress}>Linkedin</Link>
            </AboutSection>

            <AboutSection>
                <Text>Logo só possível por</Text>

                <View>
                    <Link onPress={handleFlatIconPress}>
                        https://www.flaticon.com/authors/srip
                    </Link>
                </View>
            </AboutSection>
        </Container>
    );
};

export default About;

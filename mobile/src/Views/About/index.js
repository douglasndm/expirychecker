import React from 'react';
import { View, Text } from 'react-native';

import {
    Container,
    PageTitle,
    AboutSection,
    ApplicationName,
    ApplicationVersion,
} from './styles';

const About = () => {
    return (
        <Container>
            <PageTitle>Sobre</PageTitle>

            <AboutSection>
                <ApplicationName>Controle de Validade</ApplicationName>
                <ApplicationVersion>Versão 1.0</ApplicationVersion>
            </AboutSection>

            <AboutSection>
                <Text>Desenvolvido por Douglas Nunes de Mattos</Text>
            </AboutSection>

            <AboutSection>
                <Text>Logo só possível por</Text>

                <View>
                    <Text>https://www.flaticon.com/authors/srip</Text>
                </View>
            </AboutSection>
        </Container>
    );
};

export default About;

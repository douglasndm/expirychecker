import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

import { Container, PageTitle, AboutSection, ApplicationName } from './styles';

const About = () => {
    const theme = useTheme();

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <PageTitle style={{ color: theme.colors.text }}>Sobre</PageTitle>

            <AboutSection>
                <ApplicationName style={{ color: theme.colors.text }}>
                    Controle de Validade
                </ApplicationName>
            </AboutSection>

            <AboutSection>
                <Text style={{ color: theme.colors.text }}>
                    Desenvolvido por Douglas Nunes de Mattos
                </Text>
            </AboutSection>

            <AboutSection>
                <Text style={{ color: theme.colors.text }}>
                    Logo só possível por
                </Text>

                <View>
                    <Text style={{ color: theme.colors.text }}>
                        https://www.flaticon.com/authors/srip
                    </Text>
                </View>
            </AboutSection>
        </Container>
    );
};

export default About;

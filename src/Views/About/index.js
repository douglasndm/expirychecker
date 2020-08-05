import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Button as ButtonPaper } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Container, PageTitle, AboutSection, ApplicationName } from './styles';

const About = () => {
    const theme = useTheme();
    const navigation = useNavigation();

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                <ButtonPaper
                    style={{
                        alignSelf: 'flex-end',
                    }}
                    icon={() => (
                        <Ionicons
                            name="arrow-back-outline"
                            size={28}
                            color={theme.colors.text}
                        />
                    )}
                    compact
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
                <PageTitle style={{ color: theme.colors.text }}>
                    Sobre
                </PageTitle>
            </View>

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

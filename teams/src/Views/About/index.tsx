import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button as ButtonPaper } from 'react-native-paper';

import {
    Container,
    Content,
    PageTitle,
    AboutSection,
    ApplicationName,
    Icons,
    Text,
} from './styles';

const About: React.FC = () => {
    const navigation = useNavigation();

    return (
        <Container>
            <Content>
                <ButtonPaper
                    style={{
                        alignSelf: 'flex-end',
                    }}
                    icon={() => <Icons name="arrow-back-outline" size={28} />}
                    compact
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
                <PageTitle>Sobre</PageTitle>
            </Content>

            <AboutSection>
                <ApplicationName>Controle de Validade</ApplicationName>
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

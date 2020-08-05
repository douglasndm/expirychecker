import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import {
    CheckIfSubscriptionIsActive,
    MakeASubscription,
} from '../../Functions/Premium';

import {
    Container,
    HeaderContainer,
    TitleContainer,
    IntroductionText,
    AppNameTitle,
    PremiumTitle,
    AdvantagesGroup,
    AdvantageContainer,
    AdvantageText,
    ButtonSubscription,
    TextSubscription,
} from './styles';

const PremiumSubscription = () => {
    const theme = useTheme();
    const [alreadyPremium, setAlreadyPremium] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        async function getData() {
            const check = await CheckIfSubscriptionIsActive();

            if (check) setAlreadyPremium(true);
        }
        getData();
    }, []);

    async function makeSubscription() {
        try {
            const result = await MakeASubscription();

            if (result !== false) {
                navigation.dispatch(StackActions.popToTop());
            }
        } catch (err) {
            console.warn(err);
        }
    }

    return (
        <ScrollView>
            <Container style={{ backgroundColor: theme.colors.background }}>
                <HeaderContainer
                    style={{ backgroundColor: theme.colors.accent }}
                >
                    <TitleContainer>
                        <IntroductionText>Conheça o</IntroductionText>
                        <AppNameTitle>Controle de validade</AppNameTitle>
                        <PremiumTitle>Premium</PremiumTitle>
                    </TitleContainer>
                </HeaderContainer>

                <AdvantagesGroup>
                    <AdvantageContainer
                        style={{
                            backgroundColor: theme.colors.productBackground,
                        }}
                    >
                        <AdvantageText style={{ color: theme.colors.text }}>
                            SEM ANÚNCIOS
                        </AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer
                        style={{
                            backgroundColor: theme.colors.productBackground,
                        }}
                    >
                        <AdvantageText style={{ color: theme.colors.text }}>
                            OPÇÃO PARA SALVAR SEU BANCO DE DADOS EM CASO DE
                            FORMATAÇÃO OU PERDA DO TELEFONE
                        </AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer
                        style={{
                            backgroundColor: theme.colors.productBackground,
                        }}
                    >
                        <AdvantageText style={{ color: theme.colors.text }}>
                            TEMAS EXCLUSIVOS
                        </AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer
                        style={{
                            backgroundColor: theme.colors.productBackground,
                        }}
                    >
                        <AdvantageText style={{ color: theme.colors.text }}>
                            PEQUENO VALOR A CADA TRÊS MESES
                        </AdvantageText>
                    </AdvantageContainer>
                </AdvantagesGroup>

                {alreadyPremium ? (
                    <ButtonSubscription
                        style={{ backgroundColor: theme.colors.accent }}
                    >
                        <TextSubscription>VOCÊ JÁ É PREMIUM</TextSubscription>
                    </ButtonSubscription>
                ) : (
                    <ButtonSubscription
                        style={{ backgroundColor: theme.colors.accent }}
                        onPress={makeSubscription}
                    >
                        <TextSubscription>ASSINAR POR</TextSubscription>
                        <TextSubscription>R$4,99 TRIMESTRAIS</TextSubscription>
                    </ButtonSubscription>
                )}

                <ButtonSubscription
                    style={{ backgroundColor: theme.colors.accent }}
                    onPress={() => {
                        navigation.dispatch(StackActions.popToTop());
                    }}
                >
                    <TextSubscription>Voltar ao início</TextSubscription>
                </ButtonSubscription>
            </Container>
        </ScrollView>
    );
};

export default PremiumSubscription;

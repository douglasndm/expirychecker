import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';

import {
    CheckIfSubscriptionIsActive,
    IsPlayStoreIsAvailable,
    MakeASubscription,
} from '../../Functions/Premium';

import PreferencesContext from '../../Contexts/PreferencesContext';

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
    LoadingIndicator,
} from './styles';

const PremiumSubscription: React.FC = () => {
    const [isLoadingMakeSubscription, setIsLoadingMakeSubscription] = useState<
        boolean
    >(false);
    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );
    const [alreadyPremium, setAlreadyPremium] = useState(false);
    const [playAvailable, setPlayAvailable] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        async function getData() {
            const availability = await IsPlayStoreIsAvailable();
            setPlayAvailable(availability);

            const check = await CheckIfSubscriptionIsActive();

            if (check) setAlreadyPremium(true);
        }
        getData();
    }, []);

    const makeSubscription = useCallback(async () => {
        setIsLoadingMakeSubscription(true);
        try {
            const result = await MakeASubscription();

            if (result !== false) {
                navigation.dispatch(StackActions.popToTop());

                setUserPreferences({
                    ...userPreferences,
                    isUserPremium: true,
                });
            }
        } catch (err) {
            console.warn(err);
        } finally {
            setIsLoadingMakeSubscription(false);
        }
    }, [navigation, userPreferences, setUserPreferences]);

    return (
        <Container>
            <ScrollView>
                <HeaderContainer>
                    <TitleContainer>
                        <IntroductionText>Conheça o</IntroductionText>
                        <AppNameTitle>Controle de validade</AppNameTitle>
                        <PremiumTitle>Premium</PremiumTitle>
                    </TitleContainer>
                </HeaderContainer>

                <AdvantagesGroup>
                    <AdvantageContainer>
                        <AdvantageText>SEM ANÚNCIOS</AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <AdvantageText>
                            OPÇÃO PARA SALVAR SEU BANCO DE DADOS EM CASO DE
                            FORMATAÇÃO OU PERDA DO TELEFONE
                        </AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <AdvantageText>TEMAS EXCLUSIVOS</AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <AdvantageText>
                            PEQUENO VALOR A CADA TRÊS MESES
                        </AdvantageText>
                    </AdvantageContainer>
                </AdvantagesGroup>

                {alreadyPremium ? (
                    <ButtonSubscription>
                        <TextSubscription>VOCÊ JÁ É PREMIUM</TextSubscription>
                    </ButtonSubscription>
                ) : (
                    <>
                        {playAvailable ? (
                            <ButtonSubscription
                                onPress={makeSubscription}
                                disabled={isLoadingMakeSubscription}
                            >
                                {isLoadingMakeSubscription && (
                                    <LoadingIndicator />
                                )}
                                {!isLoadingMakeSubscription && (
                                    <>
                                        <TextSubscription>
                                            ASSINAR POR
                                        </TextSubscription>
                                        <TextSubscription>
                                            R$4,99 TRIMESTRAIS
                                        </TextSubscription>
                                    </>
                                )}
                            </ButtonSubscription>
                        ) : (
                            <ButtonSubscription disabled>
                                <TextSubscription>
                                    A PLAY STORE NÃO ESTÁ DISPONÍVEL NO MOMENTO
                                </TextSubscription>
                            </ButtonSubscription>
                        )}
                    </>
                )}

                <ButtonSubscription
                    onPress={() => {
                        navigation.dispatch(StackActions.popToTop());
                    }}
                >
                    <TextSubscription>Voltar ao início</TextSubscription>
                </ButtonSubscription>
            </ScrollView>
        </Container>
    );
};

export default PremiumSubscription;

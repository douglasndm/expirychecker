import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { PurchasesPackage } from 'react-native-purchases';

import {
    getSubscriptionDetails,
    makeSubscription,
    isSubscriptionActive,
} from '../../Functions/ProMode';

import Loading from '../../Components/Loading';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isLoadingMakeSubscription, setIsLoadingMakeSubscription] = useState<
        boolean
    >(false);

    const [
        packageSubscription,
        setPackageSubscription,
    ] = useState<PurchasesPackage | null>(null);

    const [alreadyPremium, setAlreadyPremium] = useState(false);

    const navigation = useNavigation();

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const alreadyProUser = await isSubscriptionActive();
            setAlreadyPremium(alreadyProUser);

            const response = await getSubscriptionDetails();

            if (!response.availablePackages[0]) {
                setPackageSubscription(null);
                return;
            }

            setPackageSubscription(response.availablePackages[0]);
        } catch (err) {
            console.warn(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleMakeSubscription = useCallback(async () => {
        try {
            setIsLoadingMakeSubscription(true);
            await makeSubscription();
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoadingMakeSubscription(false);
        }
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
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
                    <ButtonSubscription
                        onPress={handleMakeSubscription}
                        disabled={isLoadingMakeSubscription}
                    >
                        {isLoadingMakeSubscription && <LoadingIndicator />}
                        {!isLoadingMakeSubscription && (
                            <>
                                <TextSubscription>ASSINAR POR</TextSubscription>
                                <TextSubscription>
                                    {`${packageSubscription?.product.price_string} TRIMESTRAIS`}
                                </TextSubscription>
                            </>
                        )}
                    </ButtonSubscription>
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

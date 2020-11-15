import React, { useCallback, useContext, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';

import PreferencesContext from '../../Contexts/PreferencesContext';

import Button from '../../Components/Button';

import {
    Container,
    SuccessMessageContainer,
    Title,
    Description,
} from './styles';

interface Props {
    type: 'create_batch' | 'create_product' | 'delete_batch' | 'delete_product';
}

const Success: React.FC = () => {
    const route = useRoute();
    const { reset } = useNavigation();

    const { isUserPremium } = useContext(PreferencesContext);

    const routeParams = route.params as Props;

    const type = useMemo(() => {
        return routeParams.type;
    }, [routeParams]);

    const animation = useMemo(() => {
        if (type === 'create_batch')
            return require('../../Assets/Animations/success-loading.json');
        if (type === 'create_product')
            return require('../../Assets/Animations/success-loading.json');
        if (type === 'delete_batch')
            return require('../../Assets/Animations/delete-animation.json');
        if (type === 'delete_product')
            return require('../../Assets/Animations/delete-animation.json');

        return require('../../Assets/Animations/success-loading.json');
    }, [type]);

    const handleNavigateToHome = useCallback(() => {
        reset({
            index: 1,
            routes: [{ name: 'Home' }],
        });
    }, [reset]);

    const adUnitId = useMemo(() => {
        if (__DEV__) return TestIds.BANNER;

        if (type === 'create_batch')
            return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDABATCH;

        if (type === 'create_product')
            return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDAPRODUCT;

        if (type === 'delete_batch')
            return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERDELETEABATCH;

        if (type === 'delete_product')
            return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERDELETEAPRODUCT;

        return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDAPRODUCT;
    }, [type]);

    return (
        <Container>
            <SuccessMessageContainer>
                <LottieView
                    source={animation}
                    autoPlay
                    loop={false}
                    style={{ width: 180, height: 180 }}
                />

                {type === 'create_batch' && <Title>Lote cadastrado</Title>}
                {type === 'create_product' && <Title>Produto cadastrado</Title>}
                {type === 'delete_batch' && <Title>Lote apagado</Title>}
                {type === 'delete_product' && <Title>Produto apagado</Title>}

                {type === 'create_batch' && (
                    <Description>
                        Seu lote foi cadastrado com sucesso.
                    </Description>
                )}
                {type === 'create_product' && (
                    <Description>
                        Seu produto foi cadastrado com sucesso.
                    </Description>
                )}
                {type === 'delete_batch' && (
                    <Description>Seu lote foi apagado com sucesso.</Description>
                )}
                {type === 'delete_product' && (
                    <Description>
                        Seu produto foi apagado com sucesso.
                    </Description>
                )}

                <Button
                    text="Voltar ao início"
                    onPress={handleNavigateToHome}
                />

                {!isUserPremium && (
                    <BannerAd size={BannerAdSize.BANNER} unitId={adUnitId} />
                )}
            </SuccessMessageContainer>
        </Container>
    );
};

export default Success;

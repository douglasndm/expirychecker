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
    type:
        | 'create_batch'
        | 'create_product'
        | 'edit_batch'
        | 'edit_product'
        | 'delete_batch'
        | 'delete_product';
}

const Success: React.FC = () => {
    const route = useRoute();
    const { reset } = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const routeParams = route.params as Props;

    const type = useMemo(() => {
        return routeParams.type;
    }, [routeParams]);

    const animation = useMemo(() => {
        switch (type) {
            case 'create_batch':
                return require('../../Assets/Animations/success-loading.json');

            case 'create_product':
                return require('../../Assets/Animations/success-loading.json');
            case 'edit_batch':
                return require('../../Assets/Animations/success.json');
            case 'edit_product':
                return require('../../Assets/Animations/success.json');
            case 'delete_batch':
                return require('../../Assets/Animations/delete-animation.json');
            case 'delete_product':
                return require('../../Assets/Animations/delete-animation.json');
            default:
                return require('../../Assets/Animations/success.json');
        }
    }, [type]);

    const adUnitId = useMemo(() => {
        if (__DEV__) return TestIds.BANNER;

        switch (type) {
            case 'create_batch':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDABATCH;

            case 'create_product':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDAPRODUCT;

            case 'edit_batch':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTEREDITABATCH;

            case 'edit_product':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTEREDITAPRODUCT;

            case 'delete_batch':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERDELETEABATCH;

            case 'delete_product':
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERDELETEAPRODUCT;

            default: {
                return EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDAPRODUCT;
            }
        }
    }, [type]);

    const handleNavigateToHome = useCallback(() => {
        reset({
            routes: [{ name: 'Home' }],
        });
    }, [reset]);

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
                {type === 'edit_batch' && <Title>Lote atualizado</Title>}
                {type === 'edit_product' && <Title>Produto atualizado</Title>}
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
                {type === 'edit_batch' && (
                    <Description>O lote foi atualizado.</Description>
                )}
                {type === 'edit_product' && (
                    <Description>O produto foi atualizado.</Description>
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

                {!userPreferences.isUserPremium && (
                    <BannerAd size={BannerAdSize.BANNER} unitId={adUnitId} />
                )}
            </SuccessMessageContainer>
        </Container>
    );
};

export default Success;

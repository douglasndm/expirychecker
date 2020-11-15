import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';

import Button from '../../Components/Button';

import {
    Container,
    SuccessMessageContainer,
    Title,
    Description,
} from './styles';

interface Props {
    type: 'batch' | 'product';
}

const Success: React.FC<Props> = ({ type }: Props) => {
    const { reset } = useNavigation();

    const handleNavigateToHome = useCallback(() => {
        reset({
            index: 1,
            routes: [{ name: 'Home' }],
        });
    }, [reset]);

    const adUnitId = useMemo(() => {
        return __DEV__
            ? TestIds.BANNER
            : EnvConfig.ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDAPRODUCT;
    }, []);

    return (
        <Container>
            <SuccessMessageContainer>
                <LottieView
                    source={require('../../Assets/Animations/success-loading.json')}
                    autoPlay
                    style={{ width: 180, height: 180 }}
                />

                <Title>Produto cadastrado</Title>

                <Description>
                    Seu produto foi cadastrado com sucesso
                </Description>

                <Button
                    text="Voltar ao início"
                    onPress={handleNavigateToHome}
                />

                <BannerAd size={BannerAdSize.BANNER} unitId={adUnitId} />
            </SuccessMessageContainer>
        </Container>
    );
};

export default Success;

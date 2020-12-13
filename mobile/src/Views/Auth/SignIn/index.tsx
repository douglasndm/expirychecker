import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { setUserId } from '../../../Functions/User';
import { signInWithGoogle } from '../../../Functions/Auth/Google';

import Header from '../../../Components/Header';
import GenericButton from '../../../Components/Button';
import Notification from '../../../Components/Notification';

import {
    Container,
    TextsContainer,
    FirstText,
    SecondText,
    ThirdText,
    LoginText,
    GoogleButton,
} from './styles';

const SignIn: React.FC = () => {
    const [completed, setCompleted] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const { navigate } = useNavigation();

    const handleGoogleButtonPressed = useCallback(async () => {
        try {
            setCompleted(false);

            const user = await signInWithGoogle();

            await setUserId(user.uid);

            setCompleted(true);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    const handleToGoProPage = useCallback(() => {
        navigate('PremiumSubscription');
    }, [navigate]);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    return (
        <Container>
            <Header title="Identifique-se" />
            <TextsContainer>
                <FirstText>
                    A autenticação com uma conta do Google é necessária para
                    continuar.
                </FirstText>

                <SecondText>
                    O aplicativo precisa de uma forma de identificar você caso
                    troque de telefone ou restaure este, por isso pedimos que
                    faça login com sua conta do Google.
                </SecondText>

                <ThirdText>
                    Desta forma podemos restaurar sua conta PRO sem a
                    necessidade de realizar uma nova assinatura
                </ThirdText>
            </TextsContainer>

            <LoginText>{completed ? 'Tudo certo' : 'Fazer login'}</LoginText>
            {!completed && <GoogleButton onPress={handleGoogleButtonPressed} />}

            {completed && (
                <GenericButton
                    text="Continuar para a assinatura"
                    onPress={handleToGoProPage}
                />
            )}

            {!!error && (
                <Notification
                    NotificationMessage={error}
                    NotificationType="error"
                    onPress={handleDimissNotification}
                />
            )}
        </Container>
    );
};

export default SignIn;

import React, { useCallback, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import OneSignal from 'react-native-onesignal';
import PhoneNumberInput from 'react-native-phone-number-input';
import { showMessage } from 'react-native-flash-message';

import InputText from '~/Components/InputText';
import Button from '~/Components/Button';

import { NotificationDescription } from '../styles';

import { Container, InputContainer, PhoneInput } from './styles';

const Phone: React.FC = () => {
    const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

    const phoneInput = useRef<PhoneNumberInput>(null);

    const [confirm, setConfirm] =
        useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showCodeField, setShowCodeField] = useState<boolean>(false);

    const [phone, setPhone] = useState<string>('');
    const [phoneCode, setPhoneCode] = useState<string>('');

    const handleUpdateNumber = useCallback(async () => {
        try {
            if (!phoneInput.current) {
                return;
            }

            if (!phoneInput.current.isValidNumber(phone)) {
                showMessage({
                    message: 'Número inválido',
                    type: 'warning',
                });
                return;
            }
            setIsSaving(true);

            const number = `+${phoneInput.current?.getCallingCode() + phone}`;

            const confirmation = await auth().signInWithPhoneNumber(number);
            setConfirm(confirmation);
            setShowCodeField(true);

            showMessage({
                message: 'Digite o código enviado para seu telefone',
                type: 'default',
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsSaving(false);
        }
    }, [phone]);

    const handleConfirmCode = useCallback(async () => {
        try {
            const user = await confirm?.confirm(phoneCode);

            if (user) {
                const number = `+${
                    phoneInput.current?.getCallingCode() + phone
                }`;
                OneSignal.setSMSNumber(number);
            }

            showMessage({
                message: 'Número adicionado!',
                type: 'info',
            });
            pop();
        } catch (err) {
            let { message } = err;
            if (err.code === 'auth/invalid-verification-code') {
                message = 'Código inválido';
            }
            showMessage({
                message,
                type: 'danger',
            });
        }
    }, [confirm, phone, phoneCode, pop]);

    const handlePhoneChange = useCallback(
        (value: string) => setPhone(value.trim()),
        []
    );

    const handlePhoneCodeChange = useCallback(
        (value: string) => setPhoneCode(value.trim()),
        []
    );

    return (
        <Container>
            <NotificationDescription>
                Adicione seu número de telefone e receba lembretes por SMS
            </NotificationDescription>
            <InputContainer>
                <PhoneInput
                    ref={phoneInput}
                    defaultCode="BR"
                    placeholder="Seu número"
                    value={phone}
                    onChangeText={handlePhoneChange}
                />
            </InputContainer>
            {showCodeField ? (
                <>
                    <InputText
                        placeholder="Código de verificação"
                        contentStyle={{ marginTop: 15 }}
                        value={phoneCode}
                        onChange={handlePhoneCodeChange}
                    />
                    <Button
                        text="Confirmar código"
                        onPress={handleConfirmCode}
                    />
                </>
            ) : (
                <Button
                    text="Adicionar número"
                    isLoading={isSaving}
                    onPress={handleUpdateNumber}
                />
            )}
        </Container>
    );
};

export default Phone;

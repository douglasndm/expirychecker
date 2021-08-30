import React, { useCallback, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import OneSignal from 'react-native-onesignal';
import PhoneNumberInput from 'react-native-phone-number-input';
import { showMessage } from 'react-native-flash-message';

import Header from '~/Components/Header';
import Button from '~/Components/Button';

import { Container, Content, InputContainer, PhoneInput } from './styles';

const NotificationsPreferences: React.FC = () => {
    const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

    const phoneInput = useRef<PhoneNumberInput>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const [phone, setPhone] = useState<string>('');

    const handleUpdateNumber = useCallback(() => {
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

            OneSignal.setSMSNumber(
                phoneInput.current?.getCallingCode() + phone
            );

            showMessage({
                message: 'Sucesso',
                type: 'info',
            });

            pop();
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsSaving(false);
        }
    }, [phone, pop]);

    const handlePhoneChange = useCallback(
        (value: string) => setPhone(value.trim()),
        []
    );

    return (
        <Container>
            <Header title="Notificações" noDrawer />

            <Content>
                <InputContainer>
                    <PhoneInput
                        ref={phoneInput}
                        defaultCode="BR"
                        placeholder="Seu número"
                        value={phone}
                        onChangeText={handlePhoneChange}
                    />
                </InputContainer>
                <Button
                    text="Salvar"
                    isLoading={isSaving}
                    onPress={handleUpdateNumber}
                />
            </Content>
        </Container>
    );
};

export default NotificationsPreferences;

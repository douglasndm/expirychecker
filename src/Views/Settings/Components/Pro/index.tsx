import React, { useState, useCallback, useContext, useMemo } from 'react';
import { View, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import RNPermissions from 'react-native-permissions';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { isSubscriptionActive } from '~/Functions/ProMode';
import { importBackupFile } from '~/Functions/Backup';

import Button from '~/Components/Button';

import {
    Category,
    CategoryTitle,
    CategoryOptions,
    SettingDescription,
} from '../../styles';

import {
    Container,
    PremiumButtonsContainer,
    ButtonPremium,
    ButtonPremiumText,
    ButtonCancel,
    ButtonCancelText,
    Loading,
} from './styles';

const Pro: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const [isImportLoading, setIsImportLoading] = useState<boolean>(false);

    const { navigate, reset } =
        useNavigation<StackNavigationProp<RoutesParams>>();

    const cancelSubscriptionLink = useMemo(() => {
        return Platform.OS === 'ios'
            ? 'https://apps.apple.com/account/subscriptions'
            : 'https://play.google.com/store/account/subscriptions?sku=controledevalidade_pro_monthly&package=com.controledevalidade';
    }, []);

    const handleCancel = useCallback(async () => {
        await Linking.openURL(cancelSubscriptionLink);

        if (!(await isSubscriptionActive())) {
            reset({
                routes: [{ name: 'Home' }],
            });
        }
    }, [reset, cancelSubscriptionLink]);

    const navigateToPremiumView = useCallback(() => {
        navigate('Pro');
    }, [navigate]);

    const handleImportBackup = useCallback(async () => {
        try {
            setIsImportLoading(true);

            if (Platform.OS === 'android') {
                const isReadFileAllow = await RNPermissions.check(
                    RNPermissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                );
                if (isReadFileAllow !== 'granted') {
                    const granted = await RNPermissions.request(
                        RNPermissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                    );

                    if (granted !== 'granted') {
                        throw new Error('Permission denided');
                    }
                }
            }

            await importBackupFile();

            showMessage({
                message: strings.View_Settings_Backup_Import_Alert_Sucess,
                type: 'info',
            });
            reset({
                routes: [{ name: 'Home' }],
            });
        } catch (err) {
            if (err instanceof Error) {
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
            }
        } finally {
            setIsImportLoading(false);
        }
    }, [reset]);

    return (
        <Container>
            <Category>
                <CategoryTitle>
                    {strings.View_Settings_CategoryName_Pro}
                </CategoryTitle>

                {!userPreferences.isPRO && (
                    <>
                        <Button
                            text={
                                strings.View_Settings_Button_BecobeProToUnlockNewFeatures
                            }
                            onPress={navigateToPremiumView}
                        />
                    </>
                )}

                <CategoryOptions notPremium={!userPreferences.isPRO}>
                    <View>
                        <SettingDescription>
                            {strings.View_Settings_SettingName_ExportAndInmport}
                        </SettingDescription>

                        <PremiumButtonsContainer>
                            <ButtonPremium
                                enabled={
                                    userPreferences.isPRO &&
                                    !isImportLoading
                                }
                                onPress={handleImportBackup}
                            >
                                {isImportLoading ? (
                                    <Loading />
                                ) : (
                                    <ButtonPremiumText>
                                        {
                                            strings.View_Settings_Button_ImportFile
                                        }
                                    </ButtonPremiumText>
                                )}
                            </ButtonPremium>
                        </PremiumButtonsContainer>
                    </View>
                </CategoryOptions>

                {userPreferences.isPRO && (
                    <ButtonCancel onPress={handleCancel}>
                        <ButtonCancelText>
                            {strings.View_Settings_Button_CancelSubscribe}
                        </ButtonCancelText>
                    </ButtonCancel>
                )}
            </Category>
        </Container>
    );
};

export default Pro;

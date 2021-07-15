import React, { useCallback, useEffect, useContext, useState } from 'react';
import { Linking, Platform } from 'react-native';
import Share from 'react-native-share';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { generateBackupFile } from '~/Functions/Backup';
import { getAllStores } from '~/Functions/Stores';

import Header from '~/Components/Header';
import Button from '~/Components/Button';

import {
    Container,
    Content,
    Title,
    Advantage,
    Text,
    PickerContainer,
    Picker,
    ActionButton,
    Icons,
} from './styles';

interface IStoreItem {
    label: string;
    value: string;
    key: string;
}

const Teams: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const [stores, setStores] = useState<Array<IStoreItem>>([]);

    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [selectedStore, setSelectedStore] = useState<string>(() => {
        return 'none';
    });

    const loadata = useCallback(async () => {
        const allStores = await getAllStores();

        const storesArray: Array<IStoreItem> = [];

        allStores.forEach(sto => {
            if (sto.id) {
                storesArray.push({
                    key: sto.id,
                    label: sto.name,
                    value: sto.id,
                });
            }
        });

        storesArray.push({
            key: 'none',
            label: strings.View_Export_StorePicker_NoStore,
            value: 'none',
        });

        setStores(storesArray);
    }, []);

    const handleExport = useCallback(async () => {
        try {
            setIsExporting(true);

            const path = await generateBackupFile({
                includeCategories: true,
                store: selectedStore || 'none',
            });
            await Share.open({
                title: strings.Function_Share_SaveFileTitle,
                url: `file://${path}`,
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsExporting(false);
        }
    }, [selectedStore]);

    const handleStoreChange = useCallback(value => {
        setSelectedStore(value);
    }, []);

    const handleNavigateGPlay = useCallback(async () => {
        await Linking.openURL(
            'market://details?id=dev.douglasndm.expirychecker.business'
        );
    }, []);
    const handleNavigateAppStore = useCallback(async () => {
        await Linking.openURL(
            'https://apps.apple.com/us/app/validades-para-times/id1568936353'
        );
    }, []);

    useEffect(() => {
        loadata();
    }, [loadata]);

    return (
        <Container>
            <Header title={strings.Informations_Teams_PageTitle} noDrawer />

            <Content>
                <Title>{strings.Informations_Teams_InformationsTitle}</Title>
                <Advantage>
                    {strings.Informations_Teams_AdvantagesTitle}
                </Advantage>

                <Text>{strings.Informations_Teams_Advantage1}</Text>

                <Text>{strings.Informations_Teams_Advantage2}</Text>

                <Text>{strings.Informations_Teams_Advantage3}</Text>

                <Text>{strings.Informations_Teams_Advantage4}</Text>

                <Text>{strings.Informations_Teams_AdvantageBackup}</Text>

                {userPreferences.multiplesStores && (
                    <PickerContainer
                        style={{
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                    >
                        <Picker
                            items={stores}
                            onValueChange={handleStoreChange}
                            value={selectedStore}
                            placeholder={{
                                label:
                                    strings.View_AddProduct_InputPlacehoder_Store,
                                value: 'null',
                            }}
                        />
                    </PickerContainer>
                )}

                <Button
                    text={strings.Informations_Teams_ButtonExport}
                    isLoading={isExporting}
                    onPress={handleExport}
                />

                {Platform.OS === 'android' ? (
                    <ActionButton
                        icon={() => (
                            <Icons name="logo-google-playstore" size={22} />
                        )}
                        onPress={handleNavigateGPlay}
                    >
                        {strings.Informations_Teams_ViewOnGooglePlay}
                    </ActionButton>
                ) : (
                    <ActionButton
                        icon={() => (
                            <Icons name="logo-apple-appstore" size={22} />
                        )}
                        onPress={handleNavigateAppStore}
                    >
                        {strings.Informations_Teams_ViewOnAppStore}
                    </ActionButton>
                )}
            </Content>
        </Container>
    );
};

export default Teams;

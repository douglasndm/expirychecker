import React, { useCallback, useEffect, useContext, useState } from 'react';
import { Linking } from 'react-native';
import Share from 'react-native-share';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

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
    ContactContainer,
    Link,
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
            label: translate('View_Export_StorePicker_NoStore'),
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
                title: translate('Function_Share_SaveFileTitle'),
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

    const navigateToTelegram = useCallback(async () => {
        await Linking.openURL('https://t.me/douglasdev');
    }, []);

    useEffect(() => {
        loadata();
    }, [loadata]);

    return (
        <Container>
            <Header title={translate('Informations_Teams_PageTitle')} />

            <Content>
                <Title>
                    {translate('Informations_Teams_InformationsTitle')}
                </Title>
                <Advantage>
                    {translate('Informations_Teams_AdvantagesTitle')}
                </Advantage>

                <Text>{translate('Informations_Teams_Advantage1')}</Text>

                <Text>{translate('Informations_Teams_Advantage2')}</Text>

                <Text>{translate('Informations_Teams_Advantage3')}</Text>

                <Text>{translate('Informations_Teams_Advantage4')}</Text>

                <Text>{translate('Informations_Teams_AdvantageBackup')}</Text>

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
                                label: translate(
                                    'View_AddProduct_InputPlacehoder_Store'
                                ),
                                value: 'null',
                            }}
                        />
                    </PickerContainer>
                )}

                <Button
                    text={translate('Informations_Teams_ButtonExport')}
                    isLoading={isExporting}
                    onPress={handleExport}
                />

                <ContactContainer>
                    <Text>{translate('Informations_Teams_Contact')}</Text>
                    <Link onPress={navigateToTelegram}>
                        {translate('View_About_HelpTelegram')}
                    </Link>
                </ContactContainer>
            </Content>
        </Container>
    );
};

export default Teams;

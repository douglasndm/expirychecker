import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import GenericButton from '../../Components/Button';
import { migrateProducts, migrateSettings } from '../../Functions/Migration';
import { setMigrationStatus } from '../../Functions/Settings';

import { Container, Loading, MigrateText } from './styles';

const Migration: React.FC = () => {
    const { reset } = useNavigation();
    const [isMigrating, setIsMigrating] = useState<boolean>(true);

    const migrateData = useCallback(async () => {
        setIsMigrating(true);

        await migrateSettings();
        await migrateProducts();

        await setMigrationStatus('Completed');

        setIsMigrating(false);
    }, []);

    useEffect(() => {
        migrateData();
    }, [migrateData]);

    const handleNavigateHome = useCallback(() => {
        reset({
            index: 1,
            routes: [{ name: 'Home' }],
        });
    }, [reset]);
    return (
        <Container>
            {isMigrating && (
                <>
                    <Loading />
                    <MigrateText>
                        Aguarde enquanto preparamos o aplicativo
                    </MigrateText>
                </>
            )}

            {!isMigrating && (
                <>
                    <MigrateText>Tudo pronto!</MigrateText>

                    <GenericButton
                        text="Vamos começar"
                        onPress={handleNavigateHome}
                    />
                </>
            )}
        </Container>
    );
};

export default Migration;

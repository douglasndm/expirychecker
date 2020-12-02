import React, { useCallback, useEffect, useState } from 'react';
import GenericButton from '../../Components/Button';
import { migrateProducts, migrateSettings } from '../../Functions/Migration';

import { Container, Loading, MigrateText } from './styles';

const Migration: React.FC = () => {
    const [isMigrating, setIsMigrating] = useState<boolean>(true);

    const migrateData = useCallback(async () => {
        setIsMigrating(true);

        await migrateSettings();
        await migrateProducts();

        setIsMigrating(false);
    }, []);

    useEffect(() => {
        migrateData();
    }, [migrateData]);

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

                    <GenericButton text="Vamos começar" onPress={() => {}} />
                </>
            )}
        </Container>
    );
};

export default Migration;

import React, { useCallback, useEffect } from 'react';
import { migrateSettings } from '../../Functions/Migration';

import { Container } from './styles';

const Migration: React.FC = () => {
    const migrateData = useCallback(async () => {
        await migrateSettings();
    }, []);

    useEffect(() => {
        migrateData();
    }, [migrateData]);

    return <Container />;
};

export default Migration;

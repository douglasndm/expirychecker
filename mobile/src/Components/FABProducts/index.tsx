import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { FAB } from 'react-native-paper';
import { useTheme } from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FABProducts: React.FC = () => {
    const [fabOpen, setFabOpen] = useState(false);
    const navigation = useNavigation();

    const theme = useTheme();

    return (
        <FAB.Group
            actions={[
                {
                    style: {
                        backgroundColor: theme.colors.accent,
                    },
                    color: theme.colors.accent,
                    icon: () => <Ionicons name="add" size={24} color="white" />,
                    onPress: () => {
                        navigation.push('AddProduct');
                    },
                },
            ]}
            icon={() => <Ionicons name="reader" size={24} color="#FFF" />}
            open={fabOpen}
            onStateChange={() => setFabOpen(!fabOpen)}
            visible
            onPress={() => setFabOpen(!fabOpen)}
            fabStyle={{ backgroundColor: theme.colors.accent }}
        />
    );
};

export default FABProducts;

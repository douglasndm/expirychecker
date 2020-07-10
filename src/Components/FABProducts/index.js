import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { FAB } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FABProducts = () => {
    const [fabOpen, setFabOpen] = useState(false);
    const navigation = useNavigation();

    return (
        <FAB.Group
            actions={[
                {
                    icon: () => (
                        <Ionicons name="add" size={24} color="#14d48f" />
                    ),
                    label: 'Adicionar produto',
                    onPress: () => {
                        navigation.navigate('AddProduct');
                    },
                },
            ]}
            icon={() => <Ionicons name="reader" size={24} color="#FFF" />}
            open={fabOpen}
            onStateChange={() => setFabOpen(!fabOpen)}
            visible
            onPress={() => setFabOpen(!fabOpen)}
            fabStyle={{ backgroundColor: '#14d48f' }}
        />
    );
};

export default FABProducts;

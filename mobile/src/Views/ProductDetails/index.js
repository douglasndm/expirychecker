import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FAB } from 'react-native-paper';
import { format } from 'date-fns';
import br from 'date-fns/locale/pt-BR';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Realm from '../../Services/Realm';

import {
    Container,
    PageTitle,
    ProductName,
    ProductCode,
    CategoryDetails,
    CategoryDetailsText,
    ProductLoteContainer,
    ProductLote,
    ProductAmount,
    ProductExpDate,
} from './styles';

export default ({ route }) => {
    const productId = route.params.id;

    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const [lotes, setLotes] = useState([]);

    const [fabOpen, setFabOpen] = useState(false);

    useEffect(() => {
        async function getProduct() {
            const realm = await Realm();

            try {
                const result = realm
                    .objects('Product')
                    .filtered(`id == ${productId}`)[0];

                setName(result.name);
                setCode(result.code);

                setLotes(result.lotes);
            } catch (error) {
                console.log(error);
            }
        }

        getProduct();
    }, []);

    return (
        <>
            <ScrollView>
                <Container>
                    <PageTitle>Detalhes</PageTitle>
                    <ProductName>{name}</ProductName>
                    <ProductCode>{code}</ProductCode>

                    <CategoryDetails>
                        <CategoryDetailsText>
                            Todos os lotes cadastrados
                        </CategoryDetailsText>
                    </CategoryDetails>

                    {lotes.map((lote) => (
                        <ProductLoteContainer
                            key={lote.id}
                            style={aditionalStylesForProductContainer.container}
                        >
                            <ProductLote>Lote: {lote.lote}</ProductLote>
                            <ProductAmount>
                                Quantidade: {lote.amount}
                            </ProductAmount>

                            <ProductExpDate>
                                Vence em
                                {format(lote.exp_date, ' EEEE, dd/MM/yyyy', {
                                    locale: br,
                                })}
                            </ProductExpDate>
                        </ProductLoteContainer>
                    ))}
                </Container>
            </ScrollView>

            <FAB.Group
                actions={[
                    {
                        icon: () => (
                            <Ionicons name="add" size={24} color="#14d48f" />
                        ),
                        label: 'Adicionar novo lote',
                        onPress: () => {
                            navigation.navigate('AddLote', { productId });
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
        </>
    );
};

const aditionalStylesForProductContainer = StyleSheet.create({
    container: {
        elevation: 2,
    },
});

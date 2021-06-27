import React, { useCallback, useContext, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { addDays, isPast } from 'date-fns';

import strings from '~/Locales';

import ProductCard from '~/Components/ListProducts/ProductCard';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { Container, AdView, ButtonPro, ButtonProText } from './styles';

interface RequestProps {
    product: IProduct;
    index?: number;
    disableAds?: boolean;
}

const ProductContainer: React.FC<RequestProps> = ({
    product,
    index,
    disableAds,
}: RequestProps) => {
    const { userPreferences } = useContext(PreferencesContext);
    const { navigate } = useNavigation();

    const expired = useMemo(() => {
        return product.lotes[0] && isPast(product.lotes[0].exp_date);
    }, [product.lotes]);

    const nextToExp = useMemo(() => {
        return (
            product.lotes[0] &&
            addDays(new Date(), userPreferences.howManyDaysToBeNextToExpire) >=
                product.lotes[0].exp_date
        );
    }, [userPreferences.howManyDaysToBeNextToExpire, product.lotes]);

    const showAd = useMemo(() => {
        if (disableAds) return false;
        if (userPreferences.isUserPremium) return false;
        if (index === 0) return false;
        if (index && index % 5 === 0) return true;
        return false;
    }, [disableAds, userPreferences.isUserPremium, index]);

    const handleNavigateToProPage = useCallback(() => {
        navigate('Pro');
    }, [navigate]);

    const choosenAdText = useMemo(() => {
        const result = Math.floor(Math.random() * 3) + 1;

        switch (result) {
            case 1:
                return strings.ProBanner_Text1;

            case 2:
                return strings.ProBanner_Text2;

            case 3:
                return strings.ProBanner_Text3;

            default:
                return strings.ProBanner_Text4;
        }
    }, []);

    return (
        <Container>
            {showAd && (
                <AdView>
                    <ButtonPro onPress={handleNavigateToProPage}>
                        <ButtonProText>{choosenAdText}</ButtonProText>
                    </ButtonPro>
                </AdView>
            )}

            <ProductCard
                product={product}
                expired={expired}
                nextToExp={nextToExp}
            />
        </Container>
    );
};

export default React.memo(ProductContainer);

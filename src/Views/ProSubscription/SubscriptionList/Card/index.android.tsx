import React from 'react';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';

import strings from '~/Locales';

import { getPlansString } from '~/Utils/Purchases/Plans';

import { TextSubscription } from '../styles';

import {
    DiscountLabel,
    DiscountLabelContainer,
    FirstLine,
    SubscriptionCostByMonth,
    DetailsContainer,
    SubscriptionDescription,
} from './styles';

interface Props {
    isSelected?: boolean;
    price_string: string;
    discount: number;
    pack: PurchasesPackage;
}

const Card: React.FC<Props> = ({
    isSelected,
    price_string,
    discount,
    pack,
}: Props) => {
    return (
        <DetailsContainer isSelected={isSelected}>
            <FirstLine>
                <SubscriptionCostByMonth isSelected={isSelected}>
                    {`${price_string} ${strings.View_Subscription_AfterMonthlyPrice.toUpperCase()}`}
                </SubscriptionCostByMonth>

                {discount > 0 && (
                    <DiscountLabelContainer>
                        <DiscountLabel>
                            {`${discount.toFixed(0)}% OFF`}
                        </DiscountLabel>
                    </DiscountLabelContainer>
                )}
            </FirstLine>

            {pack.packageType !== PACKAGE_TYPE.MONTHLY && (
                <SubscriptionDescription isSelected={isSelected}>
                    <TextSubscription>{getPlansString(pack)}</TextSubscription>
                </SubscriptionDescription>
            )}
        </DetailsContainer>
    );
};

export default Card;

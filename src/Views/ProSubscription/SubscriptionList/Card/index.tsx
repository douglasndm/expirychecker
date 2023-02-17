import React, { useMemo } from 'react';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';

import strings from '@expirychecker/Locales';

import { getPlansString } from '@expirychecker/Utils/Purchases/Plans';

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
	const afterFullPrice = useMemo(() => {
		if (pack.packageType === PACKAGE_TYPE.THREE_MONTH) {
			return strings.View_Subscription_AfterFullPrice_ThreeMonths;
		}
		if (pack.packageType === PACKAGE_TYPE.ANNUAL) {
			return strings.View_Subscription_AfterFullPrice;
		}
		return strings.View_Subscription_AfterMonthlyPrice;
	}, [pack.packageType]);
	return (
		<DetailsContainer isSelected={isSelected}>
			<FirstLine>
				<SubscriptionCostByMonth isSelected={isSelected}>
					{`${
						pack.product.priceString
					} ${afterFullPrice.toUpperCase()}`}
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
					<TextSubscription>
						{getPlansString(pack, price_string)}
					</TextSubscription>
				</SubscriptionDescription>
			)}
		</DetailsContainer>
	);
};

export default Card;

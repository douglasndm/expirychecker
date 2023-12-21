import styled, { css } from 'styled-components/native';

export const Container = styled.View`
	background-color: #fff;
	flex: 1;
`;

export const Content = styled.View`
	justify-content: space-between;
	flex: 1;
`;

export const AdvantagesContainer = styled.View`
	background-color: rgba(255, 255, 255, 0.25);
	padding: 10px 30px;
	margin-top: 20px;
`;

export const AdvantageContent = styled.View`
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	margin-bottom: 7px;
`;

export const Advantage = styled.Text`
	color: #000;
	font-weight: regular;
	font-size: 18px;
	flex: 1;
`;

export const AdvantageCheck = styled.Text`
	color: #261454;
	font-weight: bold;
	font-size: 22px;
`;

export const ActionsContainer = styled.View``;

export const PriceContainer = styled.View`
	margin-top: 20px;
	align-items: center;

	padding: 20px 40px;
	border-radius: 12px;
	background-color: rgba(0, 0, 0, 0.6);
	align-self: center;
	justify-content: center;
	width: 300px;
	height: 90px;
`;

export const Price = styled.Text`
	font-size: 24px;
	font-weight: bold;
	color: #ffffff;
`;

export const PricePeriod = styled.Text`
	font-weight: regular;
	opacity: 0.5;
`;

export const PriceMonthly = styled.Text`
	margin-top: 5px;
	color: #fff;
	font-weight: regular;
	font-size: 16px;
`;

export const PeriodContainer = styled.View`
	flex-direction: row;
	background-color: rgba(0, 0, 0, 0.6);
	justify-content: center;
	align-self: center;
	border-radius: 12px;
	margin-top: 20px;
`;

interface PeriodProps {
	isSelected: boolean;
}

export const Period = styled.TouchableOpacity<PeriodProps>`
	padding: 15px 25px;
	border-radius: 12px;

	${({ isSelected }) =>
		isSelected &&
		css`
			background-color: #261454;
		`}
`;

export const PeriodText = styled.Text`
	color: #fff;
	font-weight: bold;
	font-size: 18px;
`;

export const ButtonContainer = styled.TouchableOpacity`
	align-items: center;
	background-color: #261454;
	padding: 25px 40px;
	align-self: center;
	border-radius: 12px;

	margin-top: 20px;
	width: 230px;
`;

export const ButtonText = styled.Text`
	font-size: 18px;
	font-weight: bold;
	color: #fff;
	text-transform: uppercase;
`;

export const ButtonLoading = styled.ActivityIndicator``;

export const ContainerStoreNotAvailable = styled.View`
	align-items: center;
	background-color: #261454;
	padding: 25px 40px;
	align-self: center;
	border-radius: 12px;

	margin-top: 20px;
`;

export const TextStoreNotAvailable = styled.Text`
	font-size: 18px;
	font-weight: bold;
	color: #fff;
	text-transform: uppercase;
	text-align: center;
`;

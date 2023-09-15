import styled from 'styled-components/native';

export const FastSubContainer = styled.View``;

export const Container = styled.View`
	flex-direction: row;
	margin: 10px;
	background-color: #e8254f;
	padding: 25px 5px;
	border-radius: 8px;
`;

export const SubscriptionTextContainer = styled.View`
	flex: 1;
	justify-content: center;
	margin-right: 10px;
`;

export const SubscriptionText = styled.Text`
	font-family: 'Open Sans';
	font-weight: bold;
	font-size: 15px;
	text-align: center;
	color: ${props => props.theme.colors.productCardText};
`;

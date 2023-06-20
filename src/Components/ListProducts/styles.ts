import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
	flex: 1;
	padding-bottom: 15px;
	align-items: space-between;
`;

export const EmptyListText = styled.Text`
	margin-top: 10px;
	margin-left: 15px;
	margin-right: 15px;
	color: ${({ theme }) => theme.colors.text};
`;

export const InvisibleComponent = styled.View`
	margin-bottom: 100px;
`;

export const ProductContainer = styled.Pressable`
	flex-direction: row;
`;

export const SelectButtonContainer = styled.TouchableOpacity`
	justify-content: center;
	margin: 5px 0;
`;

export const SelectButton = styled.TouchableOpacity`
	margin-left: 7px;
`;

export const SelectIcon = styled(Ionicons).attrs(props => ({
	size: 36,
	color: props.theme.colors.text,
}))``;

import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
`;

export const CategoryDetails = styled.View`
    flex-direction: row;
    justify-content: space-between;

    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 5px;
`;

export const CategoryDetailsText = styled.Text`
    color: ${(props) => props.theme.colors.textAccent};
    font-size: 18px;
`;

export const EmptyListText = styled.Text`
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
    color: ${({ theme }) => theme.colors.text};
`;
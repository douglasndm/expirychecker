import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
`;

export const CategoryDetails = styled.View`
    margin-top: 15px;
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
    margin-top: 10;
    margin-left: 15;
    margin-right: 15;
    color: ${({ theme }) => theme.colors.text};
`;

import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const PageHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 5px 0 5px;
`;

export const BatchContainer = styled.View`
    margin: 10px;
`;

export const BatchTitle = styled.Text`
    font-weight: bold;
    font-size: 22px;
    font-family: 'Open Sans';
    color: ${props => props.theme.colors.text};
`;

export const BatchExpDate = styled.Text`
    font-family: 'Open Sans';
    color: ${props => props.theme.colors.text};
`;

export const BatchAmount = styled.Text`
    font-family: 'Open Sans';
    color: ${props => props.theme.colors.text};
`;

export const BatchPrice = styled.Text`
    font-family: 'Open Sans';
    color: ${props => props.theme.colors.text};
`;

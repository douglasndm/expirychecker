import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
`;

export const InputSearch = styled.TextInput.attrs(({ theme }) => ({
    placeholderColor: theme.colors.inputText,
}))`
    margin: 10px;
    background-color: ${(props) => props.theme.colors.inputBackground};
    color: ${(props) => props.theme.colors.inputText};
    border-radius: 12px;
`;

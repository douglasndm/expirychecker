import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};

    justify-content: center;
`;

export const Loading = styled.ActivityIndicator.attrs((props) => ({
    size: 78,
    color: props.theme.colors.accent,
}))`
    margin-bottom: 15px;
`;

export const MigrateText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 22px;
    text-align: center;
`;

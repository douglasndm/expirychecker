import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
    padding: 15px;
`;

export const NotificationDescription = styled.Text`
    font-family: 'Open Sans';
    font-size: 18px;
    margin-bottom: 15px;
`;

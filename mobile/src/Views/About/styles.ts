import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    padding: 16px 10px;
    background: ${(props) => props.theme.colors.background};
`;

export const Content = styled.View`
    flex-direction: row;
    margin-left: -15px;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
`;

export const AboutSection = styled.View`
    margin-top: 20px;
`;

export const ApplicationName = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
`;

export const UserId = styled.Text`
    margin-top: 10px;
    color: ${(props) => props.theme.colors.text};
`;

export const ApplicationVersion = styled.Text`
    font-size: 14px;
    color: ${(props) => props.theme.colors.subText};
`;

export const Text = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
`;

export const Link = styled.Text`
    color: ${(props) => props.theme.colors.accent};
    font-size: 14px;
`;

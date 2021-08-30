import styled from 'styled-components/native';
import Phone from 'react-native-phone-number-input';

export const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
    padding: 15px;
`;

export const InputContainer = styled.View`
    align-items: center;
`;

export const PhoneInput = styled(Phone)``;

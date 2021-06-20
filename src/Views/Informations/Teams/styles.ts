import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export const Container = styled.ScrollView`
    background-color: ${({ theme }) => theme.colors.background};
    flex: 1;
`;

export const Content = styled.View`
    margin: 10px 15px;
`;

export const Title = styled.Text`
    font-size: 22px;
    font-weight: bold;

    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.text};
`;

export const Advantage = styled.Text`
    font-size: 20px;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.text};
`;

export const Text = styled.Text`
    font-size: 16px;
    margin-bottom: 7px;
    font-family: 'Open Sans';
    color: ${({ theme }) => theme.colors.text};
`;

export const PickerContainer = styled.View`
    justify-content: space-between;

    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;

    background-color: ${({ theme }) => theme.colors.inputBackground};

    padding: 5px;
    font-size: 18px;

    ${Platform.OS === 'ios' &&
    css`
        padding: 17px 10px;
    `}
`;

export const Picker = styled(RNPickerSelect).attrs(({ theme }) => ({
    pickerProps: {
        style: {
            color: theme.colors.text,
        },
    },
    textInputProps: {
        style: {
            color: theme.colors.text,
        },
    },
}))``;

export const ContactContainer = styled.View`
    align-items: center;
    margin-top: 10px;
`;

export const Link = styled.Text`
    color: ${props => props.theme.colors.accent};
    font-size: 18px;
    margin-top: 5px;
`;

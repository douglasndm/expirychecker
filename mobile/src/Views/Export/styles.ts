import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';
import { RadioButton as Radio } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

export const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.ScrollView``;

export const ExportOptionContainer = styled.View`
    margin: 10px;
    padding: 20px;
    border-radius: 12px;
    background-color: ${props => props.theme.colors.productBackground};
`;

export const ExportExplain = styled.Text`
    font-size: 16px;
    color: ${props => props.theme.colors.text};
`;

export const SortTitle = styled.Text`
    font-size: 15px;
    font-weight: bold;
    margin: 20px 0 0 0;

    color: ${props => props.theme.colors.text};
`;

export const RadioButtonGroupContainer = styled.View`
    justify-content: center;
    align-items: center;
`;

export const RadioButtonContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const RadioButtonText = styled.Text`
    color: ${props => props.theme.colors.text};
`;

export const RadioButton = styled(Radio)``;

export const CategoryTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    font-family: 'Open Sans';
    margin: 10px 0;
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

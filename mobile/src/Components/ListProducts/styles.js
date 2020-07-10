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
    color: #81d0fd;
    font-size: 16px;
`;

export const HackComponent = styled.View`
    padding-bottom: ${(props) => (props.isHome ? 0 : 80)}px;
`;

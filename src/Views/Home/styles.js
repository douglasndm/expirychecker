import styled from 'styled-components';

export const Container = styled.View`
    flex: 1;
`;

export const HeaderContainer = styled.View`
    width: 100%;
    padding: 25px;

    justify-content: center;
    align-items: center;

    background-color: #14d48f;

    margin-bottom: 15px;
`;

export const TextLogo = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: white;
`;

export const CategoryDetails = styled.View`
    flex-direction: row;
    justify-content: space-between;

    margin-left: 15px;
    margin-right: 15px;
`;

export const CategoryDetailsText = styled.Text`
    color: #81d0fd;
    font-size: 16px;
`;

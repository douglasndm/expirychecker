import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
`;
export const HeaderContainer = styled.View`
    width: 100%;
    padding: 15px 30px 15px 0px;

    justify-content: center;
    align-items: center;

    background-color: #14d48f;

    margin-bottom: 15px;

    flex-direction: row;
    justify-content: space-around;
    align-items: center;
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
    margin-bottom: 5px;
`;

export const CategoryDetailsText = styled.Text`
    color: #14d48f;
    font-size: 18px;
`;

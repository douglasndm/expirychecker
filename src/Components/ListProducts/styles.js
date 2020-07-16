import styled from 'styled-components/native';

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
    margin-bottom: 5px;
`;

export const CategoryDetailsText = styled.Text`
    color: #14d48f;
    font-size: 18px;
`;

export const ButtonLoadMore = styled.TouchableOpacity`
    align-items: center;
    align-self: center;
    padding: 22px;

    background-color: #14d48f;
    border-radius: 12px;
    margin: 15px 0;
    elevation: 2;
`;

export const ButtonLoadMoreText = styled.Text`
    color: #fff;
`;

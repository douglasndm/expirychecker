import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
`;

export const HeaderContainer = styled.View`
    margin-left: -16px;
    margin-top: -22px;
    width: 120%;
    transform: rotate(-4deg);
`;

export const TitleContainer = styled.View`
    margin-top: 25px;
    margin-left: 30px;
    transform: rotate(4deg);
`;

export const IntroductionText = styled.Text`
    font-size: 28px;
    color: white;
`;

export const AppNameTitle = styled.Text`
    font-size: 22px;
    font-weight: bold;
    color: white;
`;

export const PremiumTitle = styled.Text`
    font-size: 58px;
    font-weight: bold;
    color: white;
`;

export const AdvantagesGroup = styled.View`
    margin-top: 35px;
    padding-left: 10px;
    padding-right: 10px;
`;

export const AdvantageContainer = styled.View`
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 15px;
    elevation: 1;
`;

export const AdvantageText = styled.Text`
    font-size: 16px;
    text-align: center;
`;

export const ButtonSubscription = styled.TouchableOpacity`
    background-color: #14d48f;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 12px;
`;

export const TextSubscription = styled.Text`
    text-align: center;
    color: white;
    font-size: 18px;
`;

import styled from 'styled-components/native';

import LogoImg from '~/Assets/Logo.png';

export const Container = styled.TouchableWithoutFeedback``;

export const LogoImage = styled.Image.attrs(() => ({
    source: LogoImg,
    resizeMode: 'cover',
}))`
    width: 120px;
    height: 120px;
`;

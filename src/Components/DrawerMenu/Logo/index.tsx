import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, Keyframe, runOnJS } from 'react-native-reanimated';

import LogoImg from '~/Assets/Logo.png';

import { Container, LogoImage } from './styles';

const styles = StyleSheet.create({
    box: {
        width: 120,
        height: 120,
    },
});

const Logo: React.FC = () => {
    const [onAnim, setOnAnim] = useState(false);

    const disableAnim = useCallback(() => {
        setOnAnim(false);
    }, []);

    const keyframe = new Keyframe({
        0: {
            transform: [{ scale: 1 }],
        },
        40: {
            transform: [{ scale: 0.4 }],
            easing: Easing.elastic(),
        },
        100: {
            transform: [{ scale: 1 }],
        },
    }).duration(400);

    const handleInitAnim = useCallback(() => {
        setOnAnim(true);
    }, []);

    return (
        <Container>
            {onAnim ? (
                <Animated.Image
                    source={LogoImg}
                    style={styles.box}
                    entering={keyframe}
                />
            ) : (
                <Container onPress={handleInitAnim}>
                    <LogoImage />
                </Container>
            )}
        </Container>
    );
};

export default Logo;

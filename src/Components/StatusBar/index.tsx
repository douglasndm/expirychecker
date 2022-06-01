import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { useTheme } from 'styled-components/native';

import { Bar } from './styles';

interface Props {
    forceWhiteTextIOS?: boolean;
}

const StatusBar: React.FC<Props> = ({ forceWhiteTextIOS }: Props) => {
    const theme = useTheme();

    const contentStyle = useMemo(() => {
        if (Platform.OS === 'ios') {
            if (forceWhiteTextIOS) {
                return 'light-content'; // For where accent colors is background
            }
            if (theme.isDark === true) {
                return 'light-content';
            }
            if (theme.isDark === false) {
                return 'dark-content';
            }
        }
        return 'light-content';
    }, [forceWhiteTextIOS, theme.isDark]);

    return <Bar animated barStyle={contentStyle} />;
};

export default StatusBar;

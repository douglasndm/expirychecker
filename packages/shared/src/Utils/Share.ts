import Share from 'react-native-share';

async function shareText({ text, title }: shareTextProps): Promise<void> {
    try {
        await Share.open({
            title,
            message: text,
        });
    } catch (err) {
        if (err instanceof Error)
            if (err.message !== 'User did not share') {
                throw new Error(err.message);
            }
    }
}

export { shareText };

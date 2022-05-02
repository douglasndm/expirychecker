import React, { useCallback } from 'react';
import { View } from 'react-native';
import Dialog from 'react-native-dialog';

import strings from '~/Locales';

interface Props {
    onConfirm: () => void;
    show: boolean;
    setShow(value: boolean): void;
}

const Component: React.FC<Props> = ({ onConfirm, show, setShow }: Props) => {
    const handleSwitchShowModal = useCallback(() => {
        setShow(!show);
    }, [setShow, show]);

    return (
        <View>
            <Dialog.Container
                visible={show}
                onBackdropPress={handleSwitchShowModal}
            >
                <Dialog.Title>
                    {strings.View_AddProduct_FillInfo_Modal_Title}
                </Dialog.Title>
                <Dialog.Description>
                    {strings.View_AddProduct_FillInfo_Modal_Description}
                </Dialog.Description>
                <Dialog.Button
                    label={strings.View_AddProduct_FillInfo_Modal_No}
                    onPress={handleSwitchShowModal}
                />
                <Dialog.Button
                    label={strings.View_AddProduct_FillInfo_Modal_Yes}
                    onPress={onConfirm}
                />
            </Dialog.Container>
        </View>
    );
};

export default Component;

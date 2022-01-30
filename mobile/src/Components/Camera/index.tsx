import React, { useState, useCallback, useRef } from 'react';
import { unlink, exists } from 'react-native-fs';
import { RNCamera } from 'react-native-camera';
import { showMessage } from 'react-native-flash-message';
import Picker, { pickSingle } from 'react-native-document-picker';

import strings from '~/Locales';

import { copyImageFromTempDirToDefinitiveDir } from '~/Functions/Products/Image';

import Header from '../Header';

import {
    Container,
    CameraContainer,
    CameraComponent,
    ButtonsContainer,
    ShotButtonContainer,
    Icons,
    PicPreview,
    PreviewContainer,
} from './styles';

export interface onPhotoTakedProps {
    fileName: string;
    filePath: string;
}
interface CameraProps {
    onPhotoTaked: ({ fileName, filePath }: onPhotoTakedProps) => void;
    onBackButtonPressed?: () => void;
}

const Camera: React.FC<CameraProps> = ({
    onPhotoTaked,
    onBackButtonPressed,
}: CameraProps) => {
    const cameraRef = useRef<RNCamera>(null);

    const [imagePath, setImagePath] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);

    const [photoImported, setPhotoImported] = useState<boolean>(false);

    const handleTakeAnotherPhoto = useCallback(async () => {
        try {
            if (imagePath && (await exists(imagePath))) {
                await unlink(imagePath);
            }

            if (!photoImported) {
                if (cameraRef && cameraRef.current) {
                    await cameraRef.current.resumePreview();
                }
            }

            setImagePath(null);
            setImageName(null);
            setPhotoImported(false);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        }
    }, [imagePath, photoImported]);

    const handleSavePhoto = useCallback(async (temp_path: string) => {
        const path = await copyImageFromTempDirToDefinitiveDir(temp_path);

        setImagePath(path.filePath);
        setImageName(path.fileName);

        return path;
    }, []);

    const hanleOpenPhotoFromLib = useCallback(async () => {
        try {
            const response = await pickSingle({
                mode: 'import',
                type: Picker.types.images,
                presentationStyle: 'formSheet',
                copyTo: 'documentDirectory',
            });

            if (response.fileCopyUri) {
                await handleSavePhoto(response.fileCopyUri);

                setPhotoImported(true);
            }
        } catch (err) {
            if (!Picker.isCancel && err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        }
    }, [handleSavePhoto]);

    const handleCapturePicture = useCallback(async () => {
        try {
            if (cameraRef && cameraRef.current) {
                const options = {
                    quality: 0.5,
                    base64: true,
                    pauseAfterCapture: true,
                    orientation: RNCamera.Constants.Orientation.portrait,
                };
                const data = await cameraRef.current.takePictureAsync(options);

                console.log(data);

                setImagePath(data.uri);

                await handleSavePhoto();
            }
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        }
    }, []);

    const handleOnPhotoTaked = useCallback(async () => {
        if (imageName && imagePath)
            onPhotoTaked({
                fileName: imageName,
                filePath: imagePath,
            });
    }, [imageName, imagePath, onPhotoTaked]);

    return (
        <Container>
            <Header
                title={
                    !imagePath
                        ? strings.Component_Camera_PageTitle
                        : strings.Component_Camera_PageTitle_OnPreview
                }
                onBackPressed={onBackButtonPressed}
                noDrawer
            />

            {photoImported && imagePath ? (
                <PreviewContainer>
                    <PicPreview source={{ uri: `file://${imagePath}` }} />
                </PreviewContainer>
            ) : (
                <CameraContainer>
                    <CameraComponent ref={cameraRef} />
                </CameraContainer>
            )}

            <ButtonsContainer>
                <ShotButtonContainer>
                    {imagePath ? (
                        <>
                            <Icons
                                name="checkmark-outline"
                                onPress={handleOnPhotoTaked}
                            />
                            <Icons
                                name="close-outline"
                                onPress={handleTakeAnotherPhoto}
                                isSelected
                            />
                        </>
                    ) : (
                        <>
                            <Icons
                                name="camera-outline"
                                onPress={handleCapturePicture}
                            />
                            <Icons
                                name="documents-outline"
                                onPress={hanleOpenPhotoFromLib}
                                isSelected
                            />
                        </>
                    )}
                </ShotButtonContainer>
            </ButtonsContainer>
        </Container>
    );
};

export default Camera;

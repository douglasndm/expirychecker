import React, { Component } from 'react';
import { RNCamera } from 'react-native-camera';

export default class Camera extends Component {
    render() {
        return <RNCamera
                captureAudio={false}
                type="back"
                ratio="21:9"
                autoFocus="on"
                flashMode="auto"
                googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.EAN_13}
                googleVisionBarcodeMode={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeMode.ALTERNATE}
                barCodeTypes={[RNCamera.Constants.BarCodeType.ean13]} />;
    }
}

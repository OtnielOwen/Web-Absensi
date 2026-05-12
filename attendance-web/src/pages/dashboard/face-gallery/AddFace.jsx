import { useEffect, useState } from 'react';
import { Typography, Card } from 'antd';
import DefaultLoading from '@/components/DefaultLoading';
import {
  isFaceDetectionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
} from '@/utilities/faceHelper';

import { UploadFromWebcam } from './components/UploadWebcam';

const { Title, Text } = Typography;

function AddFaceGalleryPage() {
  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingMessageError, setLoadingMessageError] = useState('');

  useEffect(() => {
    async function loadingtheModel() {
      await loadModels(setLoadingMessage, setLoadingMessageError);
      setIsAllModelLoaded(true);
    }
    if (
      !!isFaceDetectionModelLoaded() &&
      !!isFacialLandmarkDetectionModelLoaded() &&
      !!isFeatureExtractionModelLoaded()
    ) {
      setIsAllModelLoaded(true);
      return;
    }

    loadingtheModel();
  }, [isAllModelLoaded]);

  return (
    <>
      <Title level={3} style={{ margin: 'auto' }}>
        Tambah Album Wajah
      </Title>
      <Card style={{ marginTop: 24 }}>
        {!isAllModelLoaded ? (
          <DefaultLoading />
        ) : loadingMessageError ? (
          <div className="error">{loadingMessageError}</div>
        ) : (
          isAllModelLoaded && loadingMessageError.length === 0 && <UploadFromWebcam />
        )}
      </Card>
    </>
  );
}

export default AddFaceGalleryPage;

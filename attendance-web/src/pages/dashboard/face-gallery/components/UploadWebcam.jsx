import { useEffect, useRef, useState } from 'react';
import { Button, Form, notification, Select, Descriptions, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { convertToBlob } from '@/utilities/blobHelper';
import { DEFAULT_WEBCAM_RESOLUTION, webcamResolutionType } from '@/utilities/constant';
import { drawFaceRect } from '@/utilities/drawFaceHelper';
import { getFullFaceDescription } from '@/utilities/faceHelper';
import useFacesGalleryMutator from '../hooks/useFacesGalleryMutator';

const { Option } = Select;
const { Text } = Typography;

export const UploadFromWebcam = () => {
  const navigate = useNavigate();
  const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
  const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);
  const [inputDevices, setInputDevices] = useState([]);
  const [selectedWebcam, setSelectedWebcam] = useState();

  const [fullDesc, setFullDesc] = useState(null);

  const [faceDescriptor, setFaceDescriptor] = useState([]);
  const [previewImage, setPreviewImage] = useState('');

  const [waitText, setWaitText] = useState('');

  const webcamRef = useRef();
  const canvasRef = useRef();

  const onAddSuccess = () => {
    navigate('/dashboard/facegallery');
  };

  const { submitAdd, isLoading: isLoadingSubmit } = useFacesGalleryMutator({
    slug: null,
    onAddSuccess,
  });

  const handleSelectWebcam = (value) => {
    setSelectedWebcam(value);
  };

  const handleWebcamResolution = (value) => {
    webcamResolutionType.map((type) => {
      if (value === type.label) {
        setCamWidth(type.width);
        setCamHeight(type.height);
      }
    });
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      const inputDevice = devices.filter((device) => device.kind === 'videoinput');
      setInputDevices({ ...inputDevices, inputDevice });
    });
  }, []);

  useEffect(() => {
    function capture() {
      if (
        typeof webcamRef.current !== 'undefined' &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        setPreviewImage(webcamRef.current.getScreenshot());

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        getFullFaceDescription(webcamRef.current.getScreenshot(), 160)
          .then((data) => {
            setFullDesc(data);
            setFaceDescriptor(data[0]?.descriptor);
            setWaitText('');
          })
          .catch((err) => {
            setWaitText('Preparing face matcher and device setup, please wait...');
          });
        const ctx = canvasRef.current.getContext('2d');

        drawFaceRect(fullDesc, ctx);
      }
    }

    const interval = setInterval(() => {
      capture();
    }, 700);

    return () => clearInterval(interval);
  });

  const handleSubmit = () => {
    const toBlob = convertToBlob(previewImage);
    const blobToFile = new File([toBlob], 'photo');

    submitAdd({
      photoUrl: blobToFile,
      faceDescriptor,
    });
  };

  const onErrorNotification = () => {
    notification.open({
      type: 'error',
      message: 'Error',
      description: 'Foto tidak boleh lebih dari 2 foto!',
      placement: 'bottomLeft',
    });
  };

  return (
    <>
      <Form>
        <Form.Item label="Webcam">
          <Select defaultValue="Select Webcam" style={{ width: 500 }} onChange={handleSelectWebcam}>
            {inputDevices?.inputDevice?.map((device) => (
              <Option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Webcam Size">
          <Select
            defaultValue={DEFAULT_WEBCAM_RESOLUTION.label}
            style={{ width: 200 }}
            onChange={handleWebcamResolution}
          >
            {webcamResolutionType.map((type) => (
              <Option key={type.label} value={type.label}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <p style={{ fontSize: '18px' }}>{waitText}</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Webcam
          muted={true}
          ref={webcamRef}
          audio={false}
          width={camWidth}
          height={camHeight}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            deviceId: selectedWebcam,
          }}
          mirrored
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            textAlign: 'center',
            zindex: 8,
            width: camWidth,
            height: camHeight,
          }}
        />
      </div>
      {previewImage && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h3>Previous Capture: </h3>
          <img src={previewImage} alt="Capture" style={{ width: '200px', height: '200px' }} />
          <div style={{ marginTop: '10px' }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={
                isLoadingSubmit ||
                (fullDesc && fullDesc.length !== 1) ||
                (faceDescriptor && faceDescriptor.length !== 128)
              }
              loading={isLoadingSubmit}
            >
              Simpan
            </Button>
          </div>
        </div>
      )}

      <div>
        <Text>
          Terditeksi: <Text strong> {fullDesc ? fullDesc.length : 0} foto</Text>
          {fullDesc && fullDesc.length > 1 && onErrorNotification()}
        </Text>

        <Descriptions
          layout="vertical"
          bordered
          items={[
            {
              key: '1',
              label: 'Face Descriptors',
              children:
                fullDesc &&
                fullDesc.map((desc, index) => (
                  <div
                    key={index}
                    style={{
                      wordBreak: 'break-all',
                      marginBottom: '10px',
                      backgroundColor: 'lightblue',
                    }}
                  >
                    {desc.descriptor.toString()}
                  </div>
                )),
            },
          ]}
        />
      </div>
    </>
  );
};

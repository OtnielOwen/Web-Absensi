import { useEffect, useMemo, useRef } from 'react';
import { Flex, Alert, Spin } from 'antd';
import styled from 'styled-components';
import FaceCanvas from '@/components/FaceCanvas';
import { useFaceMesh } from '@/utilities/hooks/useFaceMesh';
import useFindBestMatch from '@/utilities/hooks/useFindBestMatch';
import { useInstructions } from '@/utilities/hooks/useInstructions';
import useMutationSubmit from '@/utilities/hooks/useMutationSubmit';

const ChildWebcamWrapper = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 550px;
`;

const StyledFrameFace = styled.div`
  position: absolute;
  top: 25%;
  left: 15%;
  width: 70%;
  height: 64%;
  box-shadow: 0px 0px 30px 299px rgba(0,0,0,0.65);
  border: 5px dashed ${({ $isVerified }) => ($isVerified ? '#52c41a' : '#d9d9d9')};
  border-radius: 50%;
  transition: all 0.3s ease;

  & .ant-alert {
    position: absolute;
    top: -25%;
    width: 100%;
    text-align: center;
  }
`;

function ProcessFaceRecognition({ faceMatcher, values, location, onSuccessAttendance }) {
  const hasSubmittedRef = useRef(false);
  const videoRef = useRef(null);

  const { submit, isLoading: isLoadingSubmit } = useMutationSubmit({
    url: '/attendance/create',
    onSuccess: () => onSuccessAttendance?.(),
  });

  const { landmarks, isLoading: isLoadingFaceMesh, modelLoaded, fullDesc } = useFaceMesh(videoRef);
  const { bestMatch } = useFindBestMatch({ fullDesc, faceMatcher });
  const { instructionList, currentInstructionIndex, isVerified, actionCounts } = useInstructions(landmarks);

  const currentInstruction = instructionList[currentInstructionIndex];

  useEffect(() => {
    if (isVerified && bestMatch && bestMatch._label !== 'unknown' && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      submit({ ...values, ...location });
    }
  }, [isVerified, bestMatch]);

  const renderInstruction = () => {
    if (!modelLoaded) return null;

    if (isVerified && !bestMatch) {
      return <Alert showIcon type="info" message="Selesai! Sedang memproses wajah..." />;
    }

    if (isVerified && bestMatch?._label === 'unknown') {
      return <Alert type="error" showIcon message="Wajah tidak dikenali, coba atur posisi" />;
    }

    if (isVerified && bestMatch?._label !== 'unknown') {
      return <Alert type="success" showIcon message="Identitas ditemukan, mengirim data..." />;
    }

    if (currentInstruction) {
      return (
        <Alert
          showIcon
          type="warning"
          message={`${currentInstruction.text} ${
            currentInstruction.type === 'blink' ? `(${actionCounts.blink}/${currentInstruction.count})` : ''
          }`}
        />
      );
    }

    return <Alert showIcon type="info" message="Posisikan wajah tepat di tengah" />;
  };

  return (
    <Spin spinning={isLoadingFaceMesh || isLoadingSubmit} tip="Memproses...">
      <Flex vertical align="center">
        <ChildWebcamWrapper>
          <video ref={videoRef} autoPlay playsInline width={720} height={576} style={{ display: 'none' }} />
          <FaceCanvas landmarks={landmarks} videoRef={videoRef} fullDesc={fullDesc} faceMatcher={faceMatcher} />
          <StyledFrameFace $isVerified={isVerified}>{renderInstruction()}</StyledFrameFace>
        </ChildWebcamWrapper>
      </Flex>
    </Spin>
  );
}

export default ProcessFaceRecognition;
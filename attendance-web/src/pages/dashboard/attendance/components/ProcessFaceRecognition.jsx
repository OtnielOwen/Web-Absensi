import { useEffect, useMemo, useRef } from 'react';
import { Flex, Alert, Spin } from 'antd';
import styled from 'styled-components';
import FaceCanvas from '@/components/FaceCanvas';

import { useFaceMesh } from '@/utilities/hooks/useFaceMesh';
import useFindBestMatch from '@/utilities/hooks/useFindBestMatch';
import { useInstructions } from '@/utilities/hooks/useInstructions';
import useMutationSubmit from '@/utilities/hooks/useMutationSubmit';

const WebcamWrapper = styled(Flex)`
  flex-direction: column;
  border-radius: 10px;
`;

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
  box-shadow: 0px 0px 30px 299px ${({ $boxShadowColor = '#fff' }) => $boxShadowColor};
  border: 8px dashed;
  border-radius: 50%;
  transition: border-color 0.3s ease;

  ${({ $borderColor }) => {
    switch ($borderColor) {
      case 'green':
        return 'border-color: #52c41a;';
      case 'red':
        return 'border-color: #ff4d4f;';
      default:
        return 'border-color: #d9d9d9;';
    }
  }}

  & .ant-alert {
    position: absolute;
    top: -30%;
    width: 100%;
    text-align: center;
  }
`;

function ProcessFaceRecognition({
  participants,
  faceMatcher,
  values,
  location,
  onSuccessAttendance,
}) {
  const hasSubmittedRef = useRef(false);
  const videoRef = useRef(null);

  const { submit, isLoading: isLoadingSubmit } = useMutationSubmit({
    url: '/attendance/create',
    onSuccess() {
      onSuccessAttendance?.();
    },
  });

  const {
    landmarks,
    isLoading: isLoadingFaceMesh,
    modelLoaded,
    fullDesc,
    loadingMessage,
  } = useFaceMesh(videoRef);

  const { bestMatch } = useFindBestMatch({
    fullDesc,
    faceMatcher,
  });

  const {
    instructionList,
    currentInstructionIndex,
    isVerified,
    actionCounts,
    colorIntruction,
  } = useInstructions(landmarks);

  const currentInstruction = useMemo(() => {
    return instructionList[currentInstructionIndex];
  }, [instructionList, currentInstructionIndex]);

  const borderColor = useMemo(() => {
    if (isVerified) return 'green';
    if (!currentInstruction) return 'default';

    return colorIntruction[currentInstruction.type] || 'default';
  }, [isVerified, currentInstruction, colorIntruction]);

  const boxShadowColor = useMemo(() => {
    if (isLoadingSubmit) return 'var(--ant-gold-5)';
    if (isVerified) return 'rgba(82,196,26,0.25)';
    return '#f7f7f7';
  }, [isLoadingSubmit, isVerified]);

  useEffect(() => {
    if (!isVerified) return;
    if (!bestMatch) return;
    if (hasSubmittedRef.current) return;

    if (bestMatch._label !== 'unknown') {
      hasSubmittedRef.current = true;

      submit({
        conditionId: values?.conditionId,
        description: values?.description,
        workingStatusId: values?.workingStatusId,
        ...location,
      });
    }
  }, [isVerified, bestMatch, submit, values, location]);

  const renderInstruction = () => {
    if (!modelLoaded) return null;

    if (isVerified && bestMatch?._label === 'unknown') {
      return (
        <Alert
          type="error"
          showIcon
          message="Wajah tidak dikenali, ulangi lagi"
        />
      );
    }

    if (isVerified && bestMatch?._label !== 'unknown') {
      return (
        <Alert
          type="success"
          showIcon
          message="Verifikasi berhasil, mengirim absensi..."
        />
      );
    }

    if (currentInstruction) {
      return (
        <Alert
          showIcon
          type="warning"
          message={
            <span>
              {currentInstruction.text}
              {currentInstruction.type === 'blink' &&
                ` (${actionCounts.blink}/${currentInstruction.count} kali)`}
            </span>
          }
        />
      );
    }

    return (
      <Alert
        showIcon
        type="info"
        message="Silakan posisikan wajah di tengah lingkaran"
      />
    );
  };

  return (
    <>
      {isLoadingFaceMesh && (
        <Alert
          type="info"
          showIcon
          message={loadingMessage}
        />
      )}

      <Spin
        spinning={isLoadingFaceMesh || isLoadingSubmit}
        style={{ marginTop: 16 }}
      >
        <WebcamWrapper
          justify="space-between"
          align="center"
          style={{ marginTop: isLoadingFaceMesh ? 16 : 0 }}
        >
          <ChildWebcamWrapper>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width={720}
              height={576}
              style={{
                visibility: 'hidden',
                display: 'none',
              }}
            />

            <FaceCanvas
              landmarks={landmarks}
              videoRef={videoRef}
              fullDesc={fullDesc}
              faceMatcher={faceMatcher}
              participants={participants}
            />

            <StyledFrameFace
              $borderColor={borderColor}
              $boxShadowColor={boxShadowColor}
            >
              {renderInstruction()}
            </StyledFrameFace>
          </ChildWebcamWrapper>
        </WebcamWrapper>
      </Spin>
    </>
  );
}

export default ProcessFaceRecognition;
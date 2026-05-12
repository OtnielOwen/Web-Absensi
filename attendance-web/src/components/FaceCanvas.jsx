import { useEffect, useRef } from 'react';
import useFindBestMatch from '@/utilities/hooks/useFindBestMatch';
import * as drawingUtils from '@mediapipe/drawing_utils';
import * as facemesh from '@mediapipe/face_mesh';

export const FaceCanvas = ({ landmarks, videoRef, faceMatcher, participants, fullDesc }) => {
  const canvasRef = useRef(null);
  const { bestMatch, x: boxX, y: boxY } = useFindBestMatch({ fullDesc, faceMatcher });

  const drawLabel = (ctx, text, x, y, backgroundColor = '#000000DD', textColor = '#FFFFFF') => {
    const padding = 4;
    ctx.font = '14px Gotham, Helvetica Neue, sans-serif';
    const metrics = ctx.measureText(text);
    const textWidth = metrics?.width;
    const textHeight = 14;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(
      x - padding,
      y - textHeight - padding,
      textWidth + padding * 2,
      textHeight + padding * 2
    );

    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);
  };

  const findOptimalLabelPosition = (landmarks, canvasWidth, canvasHeight) => {
    const foreheadPoint = landmarks[151];
    if (!foreheadPoint) return null;

    return {
      x: foreheadPoint.x * canvasWidth,
      y: foreheadPoint.y * canvasHeight - 20,
    };
  };

  useEffect(() => {
    if (!landmarks || !canvasRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    const canvasElement = canvasRef.current;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement?.width, canvasElement?.height);
    canvasCtx.drawImage(videoRef.current, 0, 0, canvasElement.width, canvasElement.height);

    // Define mesh configurations
    const drawingConfigs = [
      {
        mesh: facemesh.FACEMESH_TESSELATION,
        options: { color: '#C0C0C070', lineWidth: 1 },
      },
      {
        mesh: facemesh.FACEMESH_RIGHT_EYE,
        options: { color: '#FF3030', lineWidth: 1 },
      },
      {
        mesh: facemesh.FACEMESH_RIGHT_EYEBROW,
        options: { color: '#FF3030', lineWidth: 1 },
      },
      {
        mesh: facemesh.FACEMESH_LEFT_EYE,
        options: { color: '#30FF30', lineWidth: 1 },
      },
      {
        mesh: facemesh.FACEMESH_LEFT_EYEBROW,
        options: { color: '#30FF30', lineWidth: 1 },
      },
      {
        mesh: facemesh.FACEMESH_FACE_OVAL,
        options: { color: '#E0E0E0', lineWidth: 1 },
      },
      {
        mesh: facemesh.FACEMESH_LIPS,
        options: { color: '#E0E0E0', lineWidth: 1 },
      },
    ];

    drawingConfigs.forEach(({ mesh, options }) => {
      drawingUtils.drawConnectors(canvasCtx, landmarks, mesh, options);
    });

    if (bestMatch) {
      let label = bestMatch._label;
      if (label !== 'unknown' && participants?.user?.id === parseInt(label)) {
        label = participants.user.name;
      }

      const labelPosition = findOptimalLabelPosition(
        landmarks,
        canvasElement.width,
        canvasElement.height
      );

      if (labelPosition) {
        drawLabel(
          canvasCtx,
          `${label} (L2: ${bestMatch.distance.toFixed(2)})`,
          labelPosition.x - 50,
          labelPosition.y,
          label === 'unknown' ? '#E00000DD' : '#0E0E0EDD'
        );
      } else {
        drawLabel(
          canvasCtx,
          `${label} (L2: ${bestMatch.distance.toFixed(2)})`,
          boxX,
          boxY - 10,
          label === 'unknown' ? '#E00000DD' : '#0E0E0EDD'
        );
      }
    }

    canvasCtx.restore();
  }, [landmarks, videoRef, participants, bestMatch]);

  return <canvas ref={canvasRef} width={400} height={576} className="absolute top-0 z-10" />;
};

export default FaceCanvas;

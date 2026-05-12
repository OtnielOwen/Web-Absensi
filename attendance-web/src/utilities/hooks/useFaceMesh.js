import { useEffect, useState, useRef } from 'react';

import { FACE_MESH_CONFIG } from '@/utilities/constant';
import {
  isFaceDetectionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
  getFullFaceDescription,
} from '@/utilities/faceHelper';

import * as cam from '@mediapipe/camera_utils';
import * as facemesh from '@mediapipe/face_mesh';

const useModelLoading = () => {
  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Kamera sedang diproses...');
  const [loadingMessageError, setLoadingMessageError] = useState('');

  useEffect(() => {
    const loadModelsIfNeeded = async () => {
      if (
        !isFaceDetectionModelLoaded() ||
        !isFacialLandmarkDetectionModelLoaded() ||
        !isFeatureExtractionModelLoaded()
      ) {
        try {
          await loadModels(setLoadingMessage, setLoadingMessageError);
          setIsAllModelLoaded(true);
        } catch (error) {
          console.error(error);
          setLoadingMessageError('Failed to load models');
        }
      } else {
        setIsAllModelLoaded(true);
      }
    };

    loadModelsIfNeeded();
  }, []);

  return {
    isAllModelLoaded,
    loadingMessage,
    loadingMessageError,
  };
};

export const useFaceMesh = (videoRef) => {
  const [landmarks, setLandmarks] = useState(null);
  const [fullDesc, setFullDesc] = useState(null);
  const [isLoadingFaceMesh, setIsLoadingFaceMesh] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);

  const { isAllModelLoaded, loadingMessage, loadingMessageError } =
    useModelLoading();

  const cameraRef = useRef(null);
  const faceMeshRef = useRef(null);
  const isMountedRef = useRef(true);
  const isClosedRef = useRef(false);

  const lastFaceApiDetectionTime = useRef(0);
  const isProcessingFaceApi = useRef(false);

  const runFaceApiDetection = async () => {
    const now = Date.now();

    if (
      now - lastFaceApiDetectionTime.current < 500 ||
      isProcessingFaceApi.current ||
      !videoRef.current
    ) {
      return;
    }

    isProcessingFaceApi.current = true;

    try {
      const data = await getFullFaceDescription(videoRef.current, 160);

      if (isMountedRef.current && data) {
        setFullDesc(data);
      }

      lastFaceApiDetectionTime.current = now;
    } catch (err) {
      console.error('Face-api detection error:', err);
    } finally {
      isProcessingFaceApi.current = false;
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    if (!isAllModelLoaded || !videoRef.current) return;

    const init = async () => {
      try {
        const faceMesh = new facemesh.FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMeshRef.current = faceMesh;

        faceMesh.setOptions({
          ...FACE_MESH_CONFIG,
          maxNumFaces: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(async (results) => {
          if (!isMountedRef.current || isClosedRef.current) return;

          const face = results.multiFaceLandmarks?.[0];

          if (face) {
            setLandmarks(face);
            setIsLoadingFaceMesh(false);
            setModelLoaded(true);

            await runFaceApiDetection();
          }
        });

        const camera = new cam.Camera(videoRef.current, {
          onFrame: async () => {
            if (
              !faceMeshRef.current ||
              isClosedRef.current ||
              !videoRef.current
            ) {
              return;
            }

            try {
              await faceMeshRef.current.send({
                image: videoRef.current,
              });
            } catch (error) {
              // cegah crash deleted object
            }
          },
          width: 640,
          height: 480,
          facingMode: 'user',
        });

        cameraRef.current = camera;
        await camera.start();
      } catch (error) {
        console.error('Error starting camera:', error);
        setIsLoadingFaceMesh(false);
      }
    };

    init();

    return () => {
      isMountedRef.current = false;
      isClosedRef.current = true;

      if (cameraRef.current) {
        try {
          cameraRef.current.stop();
        } catch (e) {}
        cameraRef.current = null;
      }

      if (faceMeshRef.current) {
        try {
          faceMeshRef.current.close();
        } catch (e) {}
        faceMeshRef.current = null;
      }

      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      setLandmarks(null);
      setFullDesc(null);
      setIsLoadingFaceMesh(true);
      setModelLoaded(false);

      isProcessingFaceApi.current = false;
      lastFaceApiDetectionTime.current = 0;
    };
  }, [isAllModelLoaded, videoRef]);

  return {
    landmarks,
    fullDesc,
    isLoading: isLoadingFaceMesh && !modelLoaded,
    modelLoaded,
    loadingMessage,
    loadingMessageError,
  };
};
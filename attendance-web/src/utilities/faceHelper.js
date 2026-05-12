import * as faceapi from 'face-api.js';

export async function loadModels(setLoadingMessage, setLoadingMessageError) {
  const MODEL_URL = '/models';

  try {
    setLoadingMessage('Loaing...');
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);

    setLoadingMessage('Loading model... ');
    await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);

    await faceapi.loadFaceLandmarkModel(MODEL_URL);

    setLoadingMessage('Kamera sedang diproses...');
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
  } catch (err) {
    setLoadingMessageError('loading failed...');
  }
}

export async function getFullFaceDescription(element, inputSize = 512) {
  // tiny_face_detector options
  const scoreThreshold = 0.8;
  const OPTION = new faceapi.SsdMobilenetv1Options({
    inputSize,
    scoreThreshold,
  });
  const useTinyModel = true;

  if (typeof element === 'string') {
    element = await faceapi.fetchImage(element);
  }

  // detect all faces and generate full description directly from video element
  // including landmark and descriptor of each face
  return await faceapi
    .detectAllFaces(element, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceDescriptors();
}

export async function createMatcher(
  faceProfile,
  maxDescriptorDistance = 0.6
) {
  const labeledDescriptors = faceProfile.photos?.map((profile) => {
    const faceDescriptor = new Float32Array(
      profile?.faceDescriptor?.split(',').map(Number)
    );

    return new faceapi.LabeledFaceDescriptors(
      profile?.userId.toString(),
      [faceDescriptor]
    );
  });

  const validLabeledDescriptors = labeledDescriptors.filter(Boolean);

  if (validLabeledDescriptors.length === 0) {
    throw new Error('No valid face descriptors found');
  }

  return new faceapi.FaceMatcher(
    validLabeledDescriptors,
    maxDescriptorDistance
  );
}

export function isFaceDetectionModelLoaded() {
  return !!faceapi.nets.ssdMobilenetv1.params;
}

export function isFeatureExtractionModelLoaded() {
  return !!faceapi.nets.faceRecognitionNet.params;
}

export function isFacialLandmarkDetectionModelLoaded() {
  return !!faceapi.nets.faceLandmark68TinyNet.params;
}

export const calculateDistance = (point1, point2) => {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
};

export const calculateEAR = (landmarks) => {
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const rightEyeTop = landmarks[386];
  const rightEyeBottom = landmarks[374];

  const leftEAR =
    calculateDistance(leftEyeTop, leftEyeBottom) / calculateDistance(landmarks[33], landmarks[133]);
  const rightEAR =
    calculateDistance(rightEyeTop, rightEyeBottom) /
    calculateDistance(landmarks[362], landmarks[263]);

  return (leftEAR + rightEAR) / 2;
};

export const calculateMAR = (landmarks) => {
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];
  return calculateDistance(upperLip, lowerLip) / calculateDistance(landmarks[33], landmarks[263]);
};

export const calculateSmileFactor = (landmarks) => {
  const mouthLeft = landmarks[61];
  const mouthRight = landmarks[291];
  const mouthTop = landmarks[0];
  const mouthBottom = landmarks[17];

  const mouthWidth = calculateDistance(mouthLeft, mouthRight);
  const mouthHeight = calculateDistance(mouthTop, mouthBottom);

  return mouthWidth / mouthHeight;
};

/* eslint-disable array-callback-return */
export const drawFaceRect = (descriptions, ctx) => {
  // Loop through each desc
  if (descriptions) {
    descriptions.forEach((desc) => {
      // Extract boxes and classes
      const { x, y, width, height } = desc.detection.box;
      const landmarksPoint = desc.landmarks._positions;

      ctx.font = 'normal 18px Gotham, Helvetica Neue, sans-serif';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#08E';

      landmarksPoint.map((point) => {
        ctx.beginPath();
        ctx.fillStyle = '#08E';
        ctx.arc(point._x, point._y, 3, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.fill();
      });

      // Draw rectangles and text
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.stroke();
    });
  }
};

export const drawRectAndLabelFace = (descriptions, faceDB, participants, ctx) => {
  if (!descriptions) return;

  descriptions.forEach((desc) => {
    const { x, y, width, height } = desc.detection.box;
    const landmarksPoint = desc.landmarks._positions;
    const bestMatch = faceDB.findBestMatch(desc.descriptor);

    // Update label if the face belongs to current user
    let label = bestMatch._label;
    if (label !== 'unknown' && participants.user.id === parseInt(label)) {
      label = participants.user.name;
    }

    // Set drawing styles
    ctx.font = 'normal 18px Gotham, Helvetica Neue, sans-serif';
    ctx.lineWidth = 2;
    ctx.strokeStyle = label === 'unknown' ? '#E00' : '#0E0';
    ctx.fillStyle = label === 'unknown' ? '#E00' : '#0E0';

    // Draw landmark points
    landmarksPoint.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point._x, point._y, 3, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    });

    // Draw bounding box
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();

    // Draw labels
    ctx.fillText(label, x, y + height + 20);
    ctx.fillText(`L2: ${bestMatch.distance.toFixed(2)}`, x, y);
  });
};

export const drawFacialFeatureLabels = (ctx, landmarks, width, height) => {
  if (!landmarks) return;

  const featurePoints = {
    'Right Eye': { x: landmarks[33].x, y: landmarks[33].y },
    'Left Eye': { x: landmarks[263].x, y: landmarks[263].y },
    Nose: { x: landmarks[1].x, y: landmarks[1].y },
    Mouth: { x: landmarks[0].x, y: landmarks[0].y },
    'Right Eyebrow': { x: landmarks[70].x, y: landmarks[70].y },
    'Left Eyebrow': { x: landmarks[300].x, y: landmarks[300].y },
  };

  // Set label style
  ctx.font = '12px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 0.5;

  // Draw labels with background
  Object.entries(featurePoints).forEach(([label, point]) => {
    const x = point.x * width;
    const y = point.y * height;

    // Draw text background
    const textMetrics = ctx.measureText(label);
    const padding = 2;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(
      x - textMetrics.width / 2 - padding,
      y - 16 - padding,
      textMetrics.width + padding * 2,
      16 + padding * 2
    );

    // Draw text
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - 4);
  });
};

export const drawFaceDetectionBox = (ctx, descriptions, faceDB, participants) => {
  if (!descriptions) return;

  descriptions.forEach((desc) => {
    const { x, y, width, height } = desc.detection.box;
    const bestMatch = faceDB.findBestMatch(desc.descriptor);

    // Update label if the face belongs to current user
    let label = bestMatch._label;
    if (label !== 'unknown' && participants.user.id === parseInt(label)) {
      label = participants.user.name;
    }

    // Set styles
    ctx.font = 'normal 18px Gotham, Helvetica Neue, sans-serif';
    ctx.lineWidth = 2;
    ctx.strokeStyle = label === 'unknown' ? '#E00' : '#0E0';
    ctx.fillStyle = label === 'unknown' ? '#E00' : '#0E0';

    // Draw bounding box
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();

    // Draw name label and confidence score
    ctx.fillText(label, x, y + height + 20);
    ctx.fillText(`Confidence: ${(1 - bestMatch.distance).toFixed(2)}`, x, y);
  });
};

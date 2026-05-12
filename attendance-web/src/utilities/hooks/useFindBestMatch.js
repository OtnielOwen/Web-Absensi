const useFindBestMatch = ({ fullDesc, faceMatcher }) => {
  let bestMatch = null;
  let x;
  let y;

  fullDesc?.forEach((desc, index) => {
    x = desc.detection.box.x;
    y = desc.detection.box.y;
    bestMatch = faceMatcher.findBestMatch(desc.descriptor);
  });

  return {
    bestMatch,
    x,
    y,
  };
};

export default useFindBestMatch;

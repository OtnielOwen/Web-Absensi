import { useEffect, useState } from 'react';
import { shuffleArray } from 'face-api.js';
import { calculateEAR, calculateMAR, calculateSmileFactor } from '../calculateHelper';
import { INSTRUCTIONS, THRESHOLDS } from '../constant';
import { getRandomInt } from '../numberHelper';

export const useInstructions = (landmarks) => {
  const [instructionList, setInstructionList] = useState([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [actionCounts, setActionCounts] = useState({ mouth: 0, blink: 0, smile: 0 });
  const [mouthOpenStartTime, setMouthOpenStartTime] = useState(null);
  const [smileStartTime, setSmileStartTime] = useState(null);
  const [colorIntruction, setColorIntruction] = useState({
    smile: 'red',
    mouth: 'red',
    blink: 'red',
  });

  const generateRandomInstructions = () => {
    const shuffledInstructions = shuffleArray(INSTRUCTIONS).map((instruction) => ({
      ...instruction,
      count: instruction?.type === 'blink' ? getRandomInt(2, 5) : instruction?.count,
    }));

    setInstructionList(shuffledInstructions);
    setCurrentInstructionIndex(0);
    setActionCounts({ mouth: 0, blink: 0, smile: 0 });
    setShowAlert(true);
    setMouthOpenStartTime(null);
    setSmileStartTime(null);
    setColorIntruction({
      smile: 'red',
      mouth: 'red',
      blink: 'red',
    });
  };

  const nextInstruction = () => {
    if (currentInstructionIndex < instructionList.length - 1) {
      setCurrentInstructionIndex((prev) => prev + 1);
      setActionCounts({ mouth: 0, blink: 0, smile: 0 });
      setShowAlert(true);
      setMouthOpenStartTime(null);
      setSmileStartTime(null);
    } else {
      setIsVerified(true);
      setShowAlert(false);
    }
  };

  useEffect(() => {
    generateRandomInstructions();
  }, []);

  useEffect(() => {
    if (!landmarks || !instructionList?.length) return;

    const handlers = {
      mouth: () => handleMouthInstruction(),
      blink: () => handleBlinkInstruction(),
      smile: () => handleSmileInstruction(),
    };

    const currentInstruction = instructionList[currentInstructionIndex];
    const handler = handlers[currentInstruction?.type];
    if (handler) handler();
  }, [
    landmarks,
    instructionList,
    currentInstructionIndex,
    actionCounts,
    mouthOpenStartTime,
    smileStartTime,
  ]);

  const handleMouthInstruction = () => {
    const MAR = calculateMAR(landmarks);
    const isMouthOpen = MAR > THRESHOLDS.MAR;

    if (isMouthOpen) {
      if (!mouthOpenStartTime) {
        setMouthOpenStartTime(Date.now());
      }
      const elapsedTime = (Date.now() - mouthOpenStartTime) / 1000;
      if (elapsedTime >= instructionList[currentInstructionIndex].duration) {
        setColorIntruction((prev) => ({
          ...prev,
          mouth: 'green',
        }));
        nextInstruction();
        setMouthOpenStartTime(null);
      }
    } else {
      setMouthOpenStartTime(null);
    }
  };

  const handleBlinkInstruction = () => {
    const EAR = calculateEAR(landmarks);
    const isBlinking = EAR < THRESHOLDS.EAR;

    if (isBlinking) {
      setTimeout(() => {
        const newCount = actionCounts.blink + 1;
        setActionCounts((prev) => ({ ...prev, blink: newCount }));
        if (newCount === instructionList[currentInstructionIndex].count) {
          setColorIntruction((prev) => ({
            ...prev,
            blink: 'green',
          }));
          nextInstruction();
        }
      }, 500);
    }
  };

  const handleSmileInstruction = () => {
    const smileFactor = calculateSmileFactor(landmarks);
    const isSmiling = smileFactor > THRESHOLDS.SMILE;

    if (isSmiling) {
      if (!smileStartTime) {
        setSmileStartTime(Date.now());
      }
      const elapsedTime = (Date.now() - smileStartTime) / 1000;
      if (elapsedTime >= instructionList[currentInstructionIndex].duration) {
        setColorIntruction((prev) => ({
          ...prev,
          smile: 'green',
        }));
        nextInstruction();
        setSmileStartTime(null);
      }
    } else {
      setSmileStartTime(null);
    }
  };

  return {
    instructionList,
    currentInstructionIndex,
    showAlert,
    isVerified,
    actionCounts,
    generateRandomInstructions,
    colorIntruction,
  };
};

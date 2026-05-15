import { useEffect, useState } from 'react';
import { calculateEAR, calculateMAR, calculateSmileFactor } from '../calculateHelper';
import { INSTRUCTIONS, THRESHOLDS } from '../constant';

export const useInstructions = (landmarks) => {
  const [instructionList, setInstructionList] = useState([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [actionCounts, setActionCounts] = useState({ mouth: 0, blink: 0, smile: 0 });
  const [isLockBlink, setIsLockBlink] = useState(false);
  const [mouthOpenStartTime, setMouthOpenStartTime] = useState(null);
  const [smileStartTime, setSmileStartTime] = useState(null);

  const generateRandomInstructions = () => {
    const randomOne = [INSTRUCTIONS[Math.floor(Math.random() * INSTRUCTIONS.length)]];
    
    const singleInstruction = randomOne.map((instruction) => ({
      ...instruction,
      count: instruction?.type === 'blink' ? 2 : instruction?.count, 
      duration: 1.5, 
    }));

    setInstructionList(singleInstruction);
    setCurrentInstructionIndex(0);
    setActionCounts({ mouth: 0, blink: 0, smile: 0 });
    setIsVerified(false);
  };

  const nextInstruction = () => {
    if (currentInstructionIndex < instructionList.length - 1) {
      setCurrentInstructionIndex((prev) => prev + 1);
    } else {
      setIsVerified(true); 
    }
  };

  useEffect(() => {
    generateRandomInstructions();
  }, []);

  useEffect(() => {
    if (!landmarks || !instructionList?.length || isVerified) return;

    const currentInstruction = instructionList[currentInstructionIndex];
    
    if (currentInstruction?.type === 'mouth') handleMouthInstruction();
    if (currentInstruction?.type === 'blink') handleBlinkInstruction();
    if (currentInstruction?.type === 'smile') handleSmileInstruction();
  }, [landmarks, actionCounts, isVerified]);

  const handleMouthInstruction = () => {
    const MAR = calculateMAR(landmarks);
    if (MAR > THRESHOLDS.MAR) {
      if (!mouthOpenStartTime) setMouthOpenStartTime(Date.now());
      if ((Date.now() - mouthOpenStartTime) / 1000 >= instructionList[currentInstructionIndex].duration) {
        nextInstruction();
      }
    } else {
      setMouthOpenStartTime(null);
    }
  };

  const handleBlinkInstruction = () => {
    const EAR = calculateEAR(landmarks);
    if (EAR < THRESHOLDS.EAR && !isLockBlink) {
      setIsLockBlink(true);
      const newCount = actionCounts.blink + 1;
      setActionCounts((prev) => ({ ...prev, blink: newCount }));
      if (newCount >= instructionList[currentInstructionIndex].count) {
        nextInstruction();
      }
      setTimeout(() => setIsLockBlink(false), 400); 
    }
  };

  const handleSmileInstruction = () => {
    const smileFactor = calculateSmileFactor(landmarks);
    if (smileFactor > THRESHOLDS.SMILE) {
      if (!smileStartTime) setSmileStartTime(Date.now());
      if ((Date.now() - smileStartTime) / 1000 >= instructionList[currentInstructionIndex].duration) {
        nextInstruction();
      }
    } else {
      setSmileStartTime(null);
    }
  };

  return {
    instructionList,
    currentInstructionIndex,
    isVerified,
    actionCounts,
    generateRandomInstructions
  };
};
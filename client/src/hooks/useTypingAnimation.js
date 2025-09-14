/**
 * Custom hook for typing animation
 * Follows Single Responsibility Principle
 */
import { useState, useEffect } from "react";

export const useTypingAnimation = (
  textArray,
  typingSpeed = 100,
  pauseDuration = 2000
) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    const animate = () => {
      const currentText = textArray[currentIndex];

      if (isDeleting) {
        // Deleting animation
        setDisplayText(currentText.substring(0, displayText.length - 1));

        if (displayText === "") {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % textArray.length);
        }
      } else {
        // Typing animation
        setDisplayText(currentText.substring(0, displayText.length + 1));

        if (displayText === currentText) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
          return;
        }
      }
    };

    timeout = setTimeout(animate, isDeleting ? typingSpeed / 2 : typingSpeed);

    return () => clearTimeout(timeout);
  }, [
    displayText,
    currentIndex,
    isDeleting,
    textArray,
    typingSpeed,
    pauseDuration,
  ]);

  return displayText;
};

import { useState, useCallback } from "react";

export function usePingStates(postsList, postRefs) {
  const [pingStates, setPingStates] = useState({});
  const [currentItemIndex, setCurrentItemIndex] = useState(null);

  const checkPingStates = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const thresholdTop = viewportHeight * 0.2;
    const thresholdBottom = viewportHeight * 0.8;

    setPingStates((prevPingStates) => {
      const newPingStates = { ...prevPingStates };
      let activated = false;
      postRefs.current.forEach((ref, index) => {
        if (ref) {
          const id = postsList[index]?._id;
          const rect = ref.getBoundingClientRect();
          if (rect.top >= -thresholdTop && rect.top <= thresholdBottom) {
            if (!activated) {
              newPingStates[id] = true;
              setCurrentItemIndex(index);
              activated = true;
            } else {
              newPingStates[id] = false;
            }
          } else {
            newPingStates[id] = false;
          }
        }
      });
      return newPingStates;
    });
  }, [postsList, postRefs]);

  return { pingStates, setPingStates, checkPingStates, currentItemIndex };
}

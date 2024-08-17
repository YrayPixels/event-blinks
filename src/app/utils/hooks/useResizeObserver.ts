import { useEffect, useRef } from 'react';
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";

export function useResizeObserver(canvasClient: CanvasClient | undefined) {
  const resizeObserverRef = useRef<ResizeObserver>();

  useEffect(() => {
    if (canvasClient) {
      resizeObserverRef.current = new ResizeObserver(() => canvasClient.resize(
        {
          width: 600, //doesnt do anything yet
          height: document.body.clientHeight // might need to grab the height of something else
        }
      ));
      resizeObserverRef.current.observe(document.body);

      return () => {
        resizeObserverRef.current?.disconnect();
        canvasClient.destroy();
      };
    }
  }, [canvasClient]);
}
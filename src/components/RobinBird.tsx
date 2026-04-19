import React, { useEffect, useRef, useState } from 'react';

// The spritesheet is a 4x6 grid (4 rows, 6 columns) = 24 frames
const SPRITE_COLS = 6;
const SPRITE_ROWS = 4;
// const TOTAL_FRAMES = 24;

interface Point {
  x: number;
  y: number;
}

interface RobinBirdProps {
  isFlying: boolean;
  startElRef: React.RefObject<HTMLElement | null>;
  endElRef: React.RefObject<HTMLElement | null>;
  onLand?: () => void;
}

export const RobinBird: React.FC<RobinBirdProps> = ({ isFlying, startElRef, endElRef, onLand }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);
  const [hasLanded, setHasLanded] = useState(false);
  const [currentPos, setCurrentPos] = useState({ x: -999, y: -999, scale: 1 });
  const [spriteLoaded, setSpriteLoaded] = useState(false);

  // Initialize and load the spritesheet
  useEffect(() => {
    const img = new Image();
    // Please provide a valid path/to/my-robin-spritesheet.png here in the production build
    img.src = '/robin-spritesheet.png'; 
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      imageRef.current = img;
      setSpriteLoaded(true);
    };
  }, []);

  // Update initial position to the "perch" (e.g. behind the button)
  useEffect(() => {
    if (!isFlying && startElRef.current && !hasLanded) {
      const rect = startElRef.current.getBoundingClientRect();
      setCurrentPos({
        x: rect.left + rect.width / 2 - 50, // center offset
        y: rect.top - 70, // slightly above/behind
        scale: 1,
      });
    }
  }, [isFlying, startElRef, hasLanded]);

  // Continuously update start pos on resize if not flying
  useEffect(() => {
    if (isFlying || hasLanded) return;
    const handleResize = () => {
      if (startElRef.current) {
        const rect = startElRef.current.getBoundingClientRect();
        setCurrentPos({
          x: rect.left + rect.width / 2 - 50,
          y: rect.top - 70,
          scale: 1,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isFlying, hasLanded, startElRef]);

  const drawFrame = (frameIndex: number, width: number, height: number) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frameWidth = img.width / SPRITE_COLS;
    const frameHeight = img.height / SPRITE_ROWS;
    const col = frameIndex % SPRITE_COLS;
    const row = Math.floor(frameIndex / SPRITE_COLS);

    // Draw the specific frame from spritesheet
    ctx.drawImage(
      img,
      col * frameWidth, row * frameHeight, frameWidth, frameHeight,
      0, 0, width, height
    );

    // Canvas-based approach to remove black background
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // If pixel is very dark (close to black), make it fully transparent
      // Robin is quite brightly colored, so setting a strict black threshold works well.
      if (data[i] < 20 && data[i + 1] < 20 && data[i + 2] < 20) {
        data[i + 3] = 0;
      } else if (data[i] < 40 && data[i+1] < 40 && data[i+2] < 40) {
        // smooth anti-aliasing edge softening
        data[i + 3] = Math.max(0, data[i+3] - 150);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const getFlightPath = (t: number, start: Point, end: Point) => {
    // t is progress from 0.0 to 1.0
    // Linear progression
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const linearX = start.x + dx * t;
    const linearY = start.y + dy * t;

    // Complex path: Add a figure-8 / spiral effect
    // We use sine/cosine combined with an arc so the bird loops and swoops.
    const sweepAmplitude = Math.sin(t * Math.PI); // peaks at middle of flight
    const loopX = Math.cos(t * Math.PI * 6) * 150 * sweepAmplitude; // Spirals outward and inward
    const swoopY = -Math.sin(t * Math.PI) * 100; // swoops up in an arc

    return {
      x: linearX + loopX,
      y: linearY + swoopY,
      scale: 1 - (Math.sin(t * Math.PI) * 0.4) // Shrink down to 60% in the middle
    };
  };

  const mapFrameByProgress = (t: number, timeMs: number) => {
    // Frame mapping:
    // Standing: 0 (idle)
    // Takeoff: 1-5
    // Flying loop: 6-18
    // Landing: 19-23
    
    if (t === 0) return 0; // Standing
    if (t >= 1) return 0; // Landed, return to standing

    if (t < 0.1) {
      // Takeoff
      return Math.floor(1 + (t / 0.1) * 4); // frames 1 to 5
    } else if (t > 0.9) {
      // Landing sequence 
      const landProg = (t - 0.9) / 0.1;
      return Math.floor(19 + landProg * 4); // frames 19 to 23
    } else {
      // Flying Loop (looping frames 6 to 18 based on time to keep wings flapping constantly)
      const flyingFramesCount = 13; // 18 - 6 + 1
      const frameDelay = 60; // ms per frame for flapping speed
      return 6 + Math.floor((timeMs / frameDelay) % flyingFramesCount);
    }
  };

  useEffect(() => {
    if (!isFlying || !startElRef.current || !endElRef.current || !spriteLoaded) return;
    
    const startRect = startElRef.current.getBoundingClientRect();
    const endRect = endElRef.current.getBoundingClientRect();
    
    const startPoint = { 
      x: startRect.left + startRect.width / 2 - 50, 
      y: startRect.top - 70 
    };
    const endPoint = { 
      // land right next to the target element
      x: endRect.left + endRect.width + 10,  
      y: endRect.top + endRect.height / 2 - 50
    };

    const duration = 3500; // 3.5 seconds flight
    setHasLanded(false);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1.0);

      // 1. Calculate precise physics/path position
      const pos = getFlightPath(t, startPoint, endPoint);
      setCurrentPos(pos);

      // 2. Determine spritesheet frame based on time and path progression
      const currentFrame = mapFrameByProgress(t, elapsed);
      drawFrame(currentFrame, 100, 100); // fixed drawn bird size 100x100

      if (t < 1.0) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setHasLanded(true);
        if (onLand) onLand();
        // Draw final standing frame
        drawFrame(0, 100, 100);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      startTimeRef.current = null;
    };
  }, [isFlying, spriteLoaded, startElRef, endElRef]);

  // Initial draw of standing frame when ready
  useEffect(() => {
    if (!isFlying && spriteLoaded && !hasLanded) {
      drawFrame(0, 100, 100); 
    }
  }, [spriteLoaded, isFlying, hasLanded]);

  return (
    <div 
      style={{
        position: 'fixed',
        left: currentPos.x,
        top: currentPos.y,
        transform: `scale(max(${currentPos.scale}, 0.2))`, // ensure it never shrinks to 0
        pointerEvents: 'none',
        zIndex: 9999, // ensures it flies over everything
        width: 100,
        height: 100,
        opacity: spriteLoaded && currentPos.x !== -999 ? 1 : 0,
        transition: isFlying ? 'none' : 'opacity 0.5s ease-in'
      }}
    >
      <canvas ref={canvasRef} width={100} height={100} className="w-full h-full drop-shadow-xl" />
    </div>
  );
};

'use client';
import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, FaceLandmarker, HandLandmarker } from '@mediapipe/tasks-vision';
import { getRawImage, getProductCutout, drawFitted, Smoother, FACE, HAND, mid, dist, segAngle } from '@/lib/tryon';

export default function MediaPipeAR({
  category,
  imageUrl,
  onClose
}: {
  category: string,
  imageUrl: string,
  onClose: () => void
}) {
  const [status, setStatus] = useState('Loading photo...');
  const [progress, setProgress] = useState(10);
  const [hd, setHd] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reqRef = useRef<number>(0);
  const smootherRef = useRef(new Smoother(0.2));
  const cutoutRef = useRef<CanvasImageSource | null>(null);

  useEffect(() => {
    let active = true;
    let faceLandmarker: FaceLandmarker | null = null;
    let handLandmarker: HandLandmarker | null = null;
    let stream: MediaStream | null = null;

    const init = async () => {
      try {
        const isFace = category === 'Earrings' || category === 'Necklaces';
        const isHand = category === 'Rings' || category === 'Bangles';

        // 1. Raw photo FIRST — instant, so the mirror is never blocked by AI.
        setStatus('Loading photo...');
        cutoutRef.current = await getRawImage(imageUrl);
        if (!active) return;
        setProgress(25);

        // 2. Tracking engine (GPU, with CPU fallback for older phones).
        setStatus('Starting tracking engine...');
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        if (!active) return;
        setProgress(45);

        const makeOpts = (modelAssetPath: string, delegate: 'GPU' | 'CPU') => ({
          baseOptions: { modelAssetPath, delegate },
          runningMode: 'VIDEO' as const,
          numFaces: 1,
          numHands: 1
        });

        if (isFace) {
          try {
            faceLandmarker = await FaceLandmarker.createFromOptions(vision, makeOpts(
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task", "GPU"));
          } catch {
            faceLandmarker = await FaceLandmarker.createFromOptions(vision, makeOpts(
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task", "CPU"));
          }
        }
        if (isHand) {
          try {
            handLandmarker = await HandLandmarker.createFromOptions(vision, makeOpts(
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", "GPU"));
          } catch {
            handLandmarker = await HandLandmarker.createFromOptions(vision, makeOpts(
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", "CPU"));
          }
        }

        if (!active) return;
        setProgress(65);
        setStatus('Starting camera...');

        // 3. Camera LIVE — overlay works immediately with the raw photo.
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          if (canvasRef.current && videoRef.current.videoWidth) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        }

        if (!active) return;
        setProgress(100);
        setStatus(''); // Ready — live with photo, AI cutout upgrades silently.

        // 4. AI cutout upgrades in the BACKGROUND (cached + time-boxed in lib).
        getProductCutout(imageUrl).then((ai) => {
          if (active && ai) {
            cutoutRef.current = ai;
            setHd(true);
          }
        });

        // Render loop
        let lastTime = -1;
        const render = () => {
          if (!active) return;
          if (videoRef.current && canvasRef.current && cutoutRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx && video.videoWidth) {
              if (canvas.width !== video.videoWidth) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
              }
              const cutout = cutoutRef.current;

              // Draw video background mirrored
              ctx.save();
              ctx.scale(-1, 1);
              ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
              ctx.restore();

              const startTimeMs = performance.now();
              if (lastTime !== video.currentTime) {
                lastTime = video.currentTime;

                if (isFace && faceLandmarker) {
                  const res = faceLandmarker.detectForVideo(video, startTimeMs);
                  if (res.faceLandmarks.length > 0) {
                    const lm = res.faceLandmarks[0];
                    const left = lm[FACE.LEFT_EAR];
                    const right = lm[FACE.RIGHT_EAR];
                    const chin = lm[FACE.CHIN];

                    // Map normalized coordinates to canvas (Mirrored X)
                    const pL = { x: (1 - left.x) * canvas.width, y: left.y * canvas.height };
                    const pR = { x: (1 - right.x) * canvas.width, y: right.y * canvas.height };
                    const pC = { x: (1 - chin.x) * canvas.width, y: chin.y * canvas.height };

                    if (category === 'Earrings') {
                       const lE = smootherRef.current.ema('lE', pL);
                       const rE = smootherRef.current.ema('rE', pR);
                       const earW = dist(lE, rE) * 0.25;
                       // Draw left earring
                       drawFitted(ctx, cutout, lE.x, lE.y + earW*0.8, earW, earW);
                       // Draw right earring (mirrored)
                       drawFitted(ctx, cutout, rE.x, rE.y + earW*0.8, earW, earW, 0, true);
                    } else if (category === 'Necklaces') {
                       const neckPt = mid(pL, pR);
                       neckPt.y = pC.y + dist(neckPt, pC) * 0.4; // push down below chin
                       const smNeck = smootherRef.current.ema('neck', neckPt);
                       const angleVec = { x: Math.cos(segAngle(pR, pL)), y: Math.sin(segAngle(pR, pL)) };
                       const smAngle = smootherRef.current.ema('neckA', angleVec);
                       const ang = Math.atan2(smAngle.y, smAngle.x);
                       const width = dist(pL, pR) * 1.6;
                       drawFitted(ctx, cutout, smNeck.x, smNeck.y, width, width, ang);
                    }
                  } else {
                    smootherRef.current.reset();
                  }
                }

                if (isHand && handLandmarker) {
                  const res = handLandmarker.detectForVideo(video, startTimeMs);
                  if (res.landmarks.length > 0) {
                    const lm = res.landmarks[0];
                    if (category === 'Rings') {
                      const p1 = lm[HAND.RING_MCP];
                      const p2 = lm[HAND.RING_PIP];
                      const m = mid(p1, p2);
                      const cPt = { x: (1 - m.x) * canvas.width, y: m.y * canvas.height };
                      const rPt1 = { x: (1 - p1.x) * canvas.width, y: p1.y * canvas.height };
                      const rPt2 = { x: (1 - p2.x) * canvas.width, y: p2.y * canvas.height };
                      const sm = smootherRef.current.ema('ring', cPt);
                      const d = dist(rPt1, rPt2);
                      const a = segAngle(rPt1, rPt2);
                      drawFitted(ctx, cutout, sm.x, sm.y, d * 1.5, d * 1.5, a + Math.PI/2);
                    }
                    if (category === 'Bangles') {
                      const w = lm[HAND.WRIST];
                      const wPt = { x: (1 - w.x) * canvas.width, y: w.y * canvas.height };
                      const sm = smootherRef.current.ema('bangle', wPt);
                      const mcp = lm[HAND.INDEX_MCP];
                      const mcpPt = { x: (1 - mcp.x) * canvas.width, y: mcp.y * canvas.height };
                      const d = dist(wPt, mcpPt);
                      drawFitted(ctx, cutout, sm.x, sm.y, d * 1.5, d * 1.5);
                    }
                  } else {
                    smootherRef.current.reset();
                  }
                }
              }
            }
          }
          reqRef.current = requestAnimationFrame(render);
        };
        reqRef.current = requestAnimationFrame(render);
      } catch (err) {
        console.error(err);
        if (active) setStatus('Error loading AI Engine. Please check camera permissions and connection, then retry.');
      }
    };
    init();

    return () => {
      active = false;
      cancelAnimationFrame(reqRef.current);
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (faceLandmarker) faceLandmarker.close();
      if (handLandmarker) handLandmarker.close();
    };
  }, [category, imageUrl]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden touch-none">
      {status ? (
        <div className="absolute inset-0 z-[102] bg-zinc-900 flex flex-col items-center justify-center text-white px-6">
          <div className="w-16 h-16 border-4 border-white/20 border-t-deepgold rounded-full animate-spin mb-6"></div>
          <p className="text-[13px] font-bold tracking-widest uppercase mb-4 text-center text-deepgold">{status}</p>
          <div className="w-full max-w-[200px] h-1 bg-white/10 rounded-full overflow-hidden mb-12">
             <div className="h-full bg-deepgold transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-center text-white/50 max-w-xs leading-relaxed">
            The AI runs locally on your device for total privacy. Camera opens first — the HD cutout enhances automatically.
          </p>
          <button onClick={onClose} className="absolute top-10 right-6 text-xs uppercase tracking-widest text-white/50 hover:text-white border border-white/20 px-4 py-2 rounded-full">Cancel</button>
        </div>
      ) : null}

      <video ref={videoRef} playsInline className="hidden" />
      <canvas ref={canvasRef} className="w-full h-full object-cover" />

      {!status && (
        <div className="absolute top-10 w-full px-6 flex justify-between items-start z-[102]">
          <p className="bg-black/50 text-white text-[11px] uppercase tracking-widest px-4 py-2 border border-white/20 rounded-full backdrop-blur-md">
            AI Auto-Tracking{hd ? ' ✦ HD' : ''}
          </p>
          <button onClick={onClose} className="bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

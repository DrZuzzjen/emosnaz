import { useRef, useEffect } from 'react'
import * as faceapi from 'face-api.js'

interface VideoPlayerProps {
  videoSrc: string;
}

export default function VideoPlayer({ videoSrc }: VideoPlayerProps)
{  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const context = canvas.getContext('2d')

    const runFaceDetection = async () => {
      if (!context) return

      context.drawImage(video, 0, 0, video.width, video.height)

      const detections = await faceapi
        .detectAllFaces(canvas)
        .withFaceLandmarks()
        .withFaceExpressions()

      const resizedDetections = faceapi.resizeResults(detections, {
        width: canvas.width,
        height: canvas.height,
      })

      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

      requestAnimationFrame(runFaceDetection)
    }

    runFaceDetection()
  }, [])

  return (
    <div>
      <video ref={videoRef} autoPlay muted loop>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <canvas ref={canvasRef} />
    </div>
  )
}
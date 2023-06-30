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

      // Aseguramos que el tamaño del canvas coincide con el del video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Limpiamos el canvas antes de dibujar las detecciones
      context.clearRect(0, 0, canvas.width, canvas.height)

      const detections = await faceapi
        .detectAllFaces(video) // Detecta en el video, no en el canvas
        .withFaceLandmarks()
        .withFaceExpressions()

      const resizedDetections = faceapi.resizeResults(detections, {
        width: canvas.width,
        height: canvas.height,
      })

      // Dibujamos los cuadrados rojos para cada detección
      resizedDetections.forEach(detection => {
        const box = detection.detection.box
        context.beginPath()
        context.rect(box.x, box.y, box.width, box.height) // Cambiamos el tamaño del cuadrado a 50x50
        context.lineWidth = 2
        context.strokeStyle = 'red'
        context.fillStyle = 'red'
        context.stroke()

        // Imprime algunas detecciones en la consola
        console.log('Detecciones:', detection)
      })

      // Dibujamos los landmarks y las expresiones faciales
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

      requestAnimationFrame(runFaceDetection)
    }

    video.onloadeddata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      runFaceDetection();
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '640px', height: '480px' }}>
      <video ref={videoRef} autoPlay muted loop controls={true} style={{ position: 'absolute', top: 0, left: 0, width: '640px', height: '480px' }}>
        <source src={videoSrc} type="video/mp4"  />
      </video>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
   </div>
  )
}
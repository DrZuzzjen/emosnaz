///index.tsx

import { useEffect, useState } from 'react'
import * as faceapi from 'face-api.js' // Asegúrate de haber instalado face-api.js
import VideoPlayer from '../components/VideoPlayer'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Index() {
  const [modelsLoaded, setModelsLoaded] = useState(false)
 // crear un state "error" que se inicialice en falso tal cual la linea de arriba
 const [error, setError ] = useState(false)

 
  useEffect(() => {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ])
    .then(() => {
      setModelsLoaded(true)
    })
    .catch((error) => {
      setError(true)
      console.error('Hubo un error al cargar los modelos de face-api.js: ', error)
    });
  }, []);

  if (error) return <div>Failed to load</div>
  if (!modelsLoaded) return <div>Loading models...</div>

  return (
    <VideoPlayer videoSrc="/src_videos/3.mp4" />
  )
}

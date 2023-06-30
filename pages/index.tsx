///index.tsx

import { useEffect, useState } from 'react'
import * as faceapi from 'face-api.js' // Asegúrate de haber instalado face-api.js
import VideoPlayer from '../components/VideoPlayer'
import { ExpressionsChart } from '../components/ExpressionsChart'

import fs from 'fs';
import path from 'path';

export default function Index({ videos }) {  // Recibiendo la prop videos

  const initialVideo = (videos && videos.length > 0) ? videos[0] : '';
  const initialAverage = {
    "neutral": 0,
    "happy": 0,
    "sad": 0,
    "angry": 0,
    "fearful": 0,
    "disgusted": 0,
    "surprised": 0
  }
  const [modelsLoaded, setModelsLoaded] = useState(false)
  // crear un state "error" que se inicialice en falso tal cual la linea de arriba
  const [error, setError] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(initialVideo);
  const [detectionsData, setDetectionsData] = useState(initialAverage); // Para almacenar los datos de detección


  const handleDetectionsData = (data: any) => {
    setDetectionsData(data[0].expressions);
    // Aquí puedes hacer algo con los datos de detección, por ejemplo, console.log
    console.log('Datos de detección actualizados:', data);
  };

  const handleVideoChange = (event) => {
    setSelectedVideo(event.target.value);
  };

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
    <div>
    {/* Añade una clave al componente VideoPlayer que sea igual a selectedVideo */}
    <VideoPlayer key={selectedVideo} videoSrc={selectedVideo} onDetectionsData={handleDetectionsData} />
    <div style={{ position: 'relative', width: '640px', height: '480px' }}>
    <div>
      <h2>Select Source: </h2>
    <select value={selectedVideo} onChange={handleVideoChange}>
        {videos.map((video, index) => (
            <option key={index} value={video}>
                {video}
            </option>
        ))}
    </select>
    </div>
    <ExpressionsChart expressions={detectionsData} video={selectedVideo} />
    </div>
</div>
  )
}

export async function getServerSideProps() {
  const videosDir = path.join(process.cwd(), 'public', 'src_videos');
  const filenames = fs.readdirSync(videosDir);

  const videos = filenames.map(filename => {
    return '/src_videos/' + filename
  });

  return {
    props: {
      videos,
    },
  };
}
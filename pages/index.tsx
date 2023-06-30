import { useEffect } from 'react'
import useSWR from 'swr'
import PersonComponent from '../components/Person'
import type { Person } from '../interfaces'
import * as faceapi from 'face-api.js' // Asegúrate de haber instalado face-api.js

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
  await faceapi.nets.faceExpressionNet.loadFromUri('/models')
}

export default function Index() {
  const { data, error, isLoading } = useSWR<Person[]>('/api/people', fetcher)

  useEffect(() => {
    loadModels()
  }, [])

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>
  if (!data) return null

  return (
    <ul>
      {data.map((p) => (
        <PersonComponent key={p.id} person={p} />
      ))}
    </ul>
  )
}

const VideoPlayer = ({ videoSrc }) => {
    return (
      <video controls>
        <source src={videoSrc} type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>
    );
  };
  
  export default VideoPlayer;
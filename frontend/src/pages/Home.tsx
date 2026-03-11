import { Link } from 'react-router-dom';

const youtubeId = import.meta.env.VITE_HOME_VIDEO_ID;
const videoUrl = import.meta.env.VITE_HOME_VIDEO_URL ?? '/videos/hero.mp4';

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="hero-subtitle">Concierge Services</p>
        <h1>The leader in personalized service</h1>
        <p className="hero-tagline">Your trusted partner for seamless experiences in the Hudson Valley</p>
        <div className="hero-media">
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1`}
              title="Hudson Valley Concierge Service"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="hero-video"
            />
          ) : (
            <video
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="hero-video"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <Link to="/request" className="btn btn-primary">Leave Feedback</Link>
      </section>

      <section>
        <h2>Welcome</h2>
        <p>Explore our services and gallery.</p>
      </section>
    </>
  );
}

import CheckerCard from './CheckerCard';

function HeroSection({
  message,
  setMessage,
  handleCheck,
  isLoading,
  isSpam,
  result,
}) {
  return (
    <section id="home" className="hero">
      <div className="hero__content">
        <h1>Check if a message is Spam or Safe in seconds</h1>
        <p className="hero__lead">
          Paste any SMS or email and get an instant AI-powered confidence score — fast, accurate, and built for real-world use.
        </p>
        <div className="hero__badges">
          <span>Fast Classification</span>
          <span>NLP-Powered</span>
          <span>API-Ready</span>
        </div>
      </div>
      <CheckerCard
        message={message}
        setMessage={setMessage}
        handleCheck={handleCheck}
        isLoading={isLoading}
        isSpam={isSpam}
        result={result}
      />
    </section>
  );
}

export default HeroSection;

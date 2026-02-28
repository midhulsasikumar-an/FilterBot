function HowItWorks() {
  return (
    <section id="how" className="how">
      <h2>How It Works</h2>
      <div className="how__grid">
        <div className="how__card">
          <p className="how__step">1</p>
          <h3>Paste message</h3>
          <p>Drop any SMS or email content into the detector.</p>
        </div>
        <div className="how__card">
          <p className="how__step">2</p>
          <h3>AI analyzes text</h3>
          <p>Our NLP model scans for intent, tone, and spam signals.</p>
        </div>
        <div className="how__card">
          <p className="how__step">3</p>
          <h3>Result shown instantly</h3>
          <p>Get a clean Spam vs Safe verdict with confidence.</p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

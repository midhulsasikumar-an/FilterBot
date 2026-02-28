function AboutSection() {
  return (
    <section id="about" className="about">
      <div>
        <h2>About</h2>
        <p>
          Filterbot uses an AI/ML pipeline for spam detection leveraging advanced NLP techniques. 
          It analyses message content for keywords, intent patterns, and phrasing signals to deliver 
          accurate, real-time classifications — and can connect to any backend prediction API for production deployments.
        </p>
      </div>
      <div className="about__panel">
        <div>
          <p className="about__label">Model Focus</p>
          <p className="about__value">Text Classification</p>
        </div>
        <div>
          <p className="about__label">Signals Used</p>
          <p className="about__value">Keywords, intent, phrasing</p>
        </div>
        <div>
          <p className="about__label">Integration</p>
          <p className="about__value">REST API / ML Inference</p>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;

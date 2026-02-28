function Navbar() {
  return (
    <header className="nav">
      <div className="nav__logo">
        <img className="logo-mark" src="/logo.png" alt="Spam Message Detector logo" />
        <div className="nav__branding">
          <p className="nav__brand" aria-label="FilterBot">
            <span className="nav__brand-filter">Filter</span>
            <span className="nav__brand-bot">Bot</span>
          </p>
          <p className="nav__title">Spam Message Detector</p>
          <p className="nav__subtitle">AI/NLP Safety Toolkit</p>
        </div>
      </div>
      <nav className="nav__links">
        <a href="#home">Home</a>
        <a href="#how">How It Works</a>
        <a href="#about">About</a>
      </nav>
    </header>
  );
}

export default Navbar;

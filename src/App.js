import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';

function App() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({
    label: 'Not Spam',
    confidence: null,
  });
  const [prediction, setPrediction] = useState('');

  const handleCheck = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setPrediction('');

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction from backend');
      }

      const data = await response.json();
      const label = data?.prediction || 'Unknown';
      const confidence =
        typeof data?.confidence === 'number' ? data.confidence : null;
      setPrediction(label);
      setResult({
        label,
        confidence,
      });
    } catch (error) {
      setPrediction('Error');
      setResult({
        label: 'Error',
        confidence: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const displayLabel = prediction || result.label;
  const isSpam = displayLabel === 'Spam';

  return (
    <div className="app">
      <Navbar />
      <main>
        <HeroSection
          message={message}
          setMessage={setMessage}
          handleCheck={handleCheck}
          isLoading={isLoading}
          isSpam={isSpam}
          result={{ ...result, label: displayLabel }}
        />
        <HowItWorks />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;

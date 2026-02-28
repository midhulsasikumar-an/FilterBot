function CheckerCard({
  message,
  setMessage,
  handleCheck,
  isLoading,
  isSpam,
  result,
}) {
  return (
    <div className="hero__card">
      <form className="checker" onSubmit={handleCheck}>
        <label htmlFor="message" className="checker__label">
          Paste your message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Example: Congratulations! You have been selected for a free gift card. Click the link to claim..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={8}
          required
        />
        <button className="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Check for Spam'}
        </button>
      </form>

      <div className={`result ${isSpam ? 'result--spam' : 'result--safe'}`}>
        <div className="result__header">
          <p className="result__title">Classification Result</p>
          <span className="result__badge">
            {isLoading ? 'Analyzing' : result.label}
          </span>
        </div>
        <p className="result__score">
          Confidence
          <span>
            {isLoading ? (
              <span className="loading">
                <span />
                <span />
                <span />
              </span>
            ) : (
              result.confidence != null ? `${result.confidence}%` : 'N/A'
            )}
          </span>
        </p>
        <p className="result__note">
          {isLoading
            ? 'Running NLP features across your message...'
            : isSpam
            ? 'We detected patterns commonly linked with phishing or scams.'
            : 'Looks safe based on spam keyword and intent signals.'}
        </p>
      </div>
    </div>
  );
}

export default CheckerCard;

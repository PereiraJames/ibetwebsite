import { useEffect, useState } from "react";

function TelegramRedirector() {
  const [inTelegram, setInTelegram] = useState(false);

  useEffect(() => {
    if (/Telegram/i.test(navigator.userAgent)) {
      setInTelegram(true);
    }
  }, []);

  if (!inTelegram) return null;

  const externalUrl = "https://ibetmarkandmajella.com"; // replace with your actual domain

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>
        Google Login doesn't work inside Telegram. Please open this in your
        browser.
      </p>
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: "#007bff",
          padding: "10px 20px",
          color: "white",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        Open in Chrome/Safari
      </a>
    </div>
  );
}

export default TelegramRedirector;
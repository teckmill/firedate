import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

const TwoFactorSetup: React.FC = () => {
  const { data: session } = useSession();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState('');

  const setupTwoFactor = async () => {
    const response = await fetch('/api/2fa/setup', { method: 'POST' });
    if (response.ok) {
      const data = await response.json();
      setQrCode(data.qrCodeDataUrl);
      setSecret(data.secret);
    }
  };

  const verifyToken = async () => {
    const response = await fetch('/api/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (response.ok) {
      alert('Two-factor authentication enabled successfully!');
    } else {
      alert('Invalid token. Please try again.');
    }
  };

  return (
    <div>
      <h2>Two-Factor Authentication Setup</h2>
      {!qrCode && (
        <button onClick={setupTwoFactor}>Set up 2FA</button>
      )}
      {qrCode && (
        <>
          <p>Scan this QR code with your authenticator app:</p>
          <img src={qrCode} alt="2FA QR Code" />
          <p>Or enter this secret manually: {secret}</p>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter token"
          />
          <button onClick={verifyToken}>Verify</button>
        </>
      )}
    </div>
  );
};

export default TwoFactorSetup;
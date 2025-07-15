import React, { useState, useEffect, useRef } from 'react';

// measure a quick ping using multiple fallback methods
async function measurePing() {
  const start = performance.now();
  
  // Try multiple URLs that are more likely to work
  const urls = [
    'https://www.google.com/favicon.ico',
    'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
  ];
  
  for (const url of urls) {
    try {
      const response = await fetch(url, { 
        method: 'HEAD', 
        cache: 'no-store',
        mode: 'no-cors' // This helps with CORS issues
      });
      return Math.round(performance.now() - start);
    } catch (error) {
      continue; // Try next URL
    }
  }
  
  // If all URLs fail, return RTT as fallback
  return null;
}

// Real-time speed test function
async function measureActualSpeed() {
  const testUrl = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js'; // ~88KB file
  const startTime = performance.now();
  
  try {
    const response = await fetch(testUrl, { cache: 'no-store' });
    const data = await response.blob();
    const endTime = performance.now();
    
    const fileSize = data.size; // bytes
    const duration = (endTime - startTime) / 1000; // seconds
    const speedBps = fileSize / duration; // bytes per second
    const speedMbps = (speedBps * 8) / (1024 * 1024); // Convert to Mbps
    
    return Math.round(speedMbps * 10) / 10; // Round to 1 decimal
  } catch (error) {
    return null;
  }
}

function useNetworkHealth() {
  const [health, setHealth] = useState({
    type: 'unknown',
    downlink: null,
    rtt: null,
    tip: '',
    ping: null,
    publicIP: null,
    actualSpeed: null,
  });

  useEffect(() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    const update = async () => {
      const type = conn?.effectiveType || conn?.type || 'unknown';
      const downlink = conn?.downlink ?? null; // Browser estimated speed
      const rtt = conn?.rtt ?? null; // ms
      
      // Try to get ping, fallback to RTT if ping fails
      let ping = await measurePing();
      if (ping === null && rtt !== null) {
        ping = rtt; // Use RTT as fallback
      }
      
      // Measure actual speed
      const actualSpeed = await measureActualSpeed();
      
      const tip = (rtt != null && rtt > 200) || (ping != null && ping > 200)
        ? 'High latency detected — consider checking VPN or router settings.' 
        : 'Latency looks good.';
      
      try {
        const { ip: publicIP } = await fetch('https://api.ipify.org?format=json')
          .then(r => r.json());
        setHealth({ type, downlink, rtt, tip, ping, publicIP, actualSpeed });
      } catch (error) {
        // If IP fetch fails, still update other values
        setHealth({ type, downlink, rtt, tip, ping, publicIP: 'Unable to fetch', actualSpeed });
      }
    };

    // initial + listen for changes
    update();
    
    // Update actual speed every 10 seconds
    const speedInterval = setInterval(async () => {
      const actualSpeed = await measureActualSpeed();
      setHealth(prev => ({ ...prev, actualSpeed }));
    }, 10000);
    
    if (conn) {
      conn.addEventListener('change', update);
      return () => {
        conn.removeEventListener('change', update);
        clearInterval(speedInterval);
      };
    }
    
    return () => clearInterval(speedInterval);
  }, []);

  return health;
}

// Canvas component for real-time ping visualization
function PingChart({ ping, rtt }) {
  const canvasRef = useRef(null);
  const [pingHistory, setPingHistory] = useState([]);
  
  useEffect(() => {
    // Use ping if available, otherwise use RTT
    const currentValue = ping !== null ? ping : rtt;
    
    if (currentValue !== null) {
      setPingHistory(prev => {
        const newHistory = [...prev, currentValue];
        // Keep only last 30 readings
        return newHistory.slice(-30);
      });
    }
  }, [ping, rtt]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || pingHistory.length === 0) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw ping line
    if (pingHistory.length > 1) {
      const maxPing = Math.max(...pingHistory, 100);
      const stepX = width / (pingHistory.length - 1);
      
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      pingHistory.forEach((pingVal, i) => {
        const x = i * stepX;
        const y = height - (pingVal / maxPing) * height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw points
      ctx.fillStyle = '#3b82f6';
      pingHistory.forEach((pingVal, i) => {
        const x = i * stepX;
        const y = height - (pingVal / maxPing) * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
    
    // Draw current value (ping or RTT)
    const currentValue = ping !== null ? ping : rtt;
    const label = ping !== null ? 'Ping' : 'RTT';
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`${label}: ${currentValue}ms`, width - 10, 20);
    
  }, [pingHistory, ping, rtt]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={120}
      className="w-full h-30 rounded border border-gray-600"
    />
  );
}

// Canvas component for network strength visualization
function NetworkStrengthMeter({ downlink, type, actualSpeed }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw meter background
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    // Background arc
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0);
    ctx.stroke();
    
    // Use actual speed if available, otherwise use downlink
    const speedToUse = actualSpeed !== null ? actualSpeed : downlink;
    
    // Calculate fill percentage based on speed
    let fillPercentage = 0;
    if (speedToUse !== null) {
      fillPercentage = Math.min(speedToUse / 50, 1); // Assume 50 Mbps is full for actual speed
    }
    
    // Color based on speed
    let color = '#ef4444'; // red for slow
    if (fillPercentage > 0.2) color = '#f59e0b'; // yellow for medium
    if (fillPercentage > 0.5) color = '#10b981'; // green for fast
    
    // Draw filled arc
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + (Math.PI * fillPercentage));
    ctx.stroke();
    
    // Draw speed text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    if (actualSpeed !== null) {
      ctx.fillText(`${actualSpeed.toFixed(1)} Mbps`, centerX, centerY - 5);
      ctx.font = '10px Arial';
      ctx.fillText('(Real-time)', centerX, centerY + 10);
    } else {
      ctx.fillText(
        downlink !== null ? `${downlink.toFixed(1)} Mbps` : '—',
        centerX,
        centerY + 5
      );
      ctx.font = '10px Arial';
      ctx.fillText('(Estimated)', centerX, centerY + 20);
    }
    
    // Draw connection type
    ctx.font = '12px Arial';
    ctx.fillText(type, centerX, centerY + 35);
    
  }, [downlink, type, actualSpeed]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={120}
      className="w-full h-30"
    />
  );
}

export default function NetworkCards() {
  const { type, downlink, rtt, tip, ping, publicIP, actualSpeed } = useNetworkHealth();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      {/* ── Card 1: Connection metrics ── */}
      <div className="bg-gray-800 m-5 text-white rounded-lg p-6 shadow-lg transform hover:scale-105 hover:-translate-y-2 transition-all">
        <h3 className="text-xl font-semibold mb-4">Connection Metrics</h3>
        <p className="mb-2 text-lg">Type: <span className="text-lg">{type}</span></p>
        <p className="mb-2 text-lg">
          Browser Est.: <span className="text-lg">
            {downlink != null ? `${downlink.toFixed(1)} Mbps` : '—'}
          </span>
        </p>
        <p className="mb-2 text-lg">
          Real Speed: <span className="text-lg">
            {actualSpeed != null ? `${actualSpeed.toFixed(1)} Mbps` : 'Testing...'}
          </span>
        </p>
        <p className="mb-2 text-lg">RTT: <span className="text-lg">{rtt ?? '—'} ms</span></p>
        <p className="text-lg">Ping: <span className="text-lg">{ping ?? '—'} ms</span></p>
        
        {/* Canvas: Network Strength Meter */}
        <div className="mt-4">
          <NetworkStrengthMeter downlink={downlink} type={type} actualSpeed={actualSpeed} />
        </div>
      </div>

      {/* ── Card 2: Diagnostics & IP ── */}
      <div className="bg-gray-800 m-5 text-white rounded-lg p-6 shadow-lg transform hover:scale-105 hover:-translate-y-2 transition-all">
        <h3 className="text-xl font-semibold mb-4">Diagnostics</h3>
        <div className="flex items-center mb-4">
          <span className="text-green-400 mr-2"></span>
          <span className="text-sm">{tip}</span>
        </div>
        <p className="text-lg">
          Public IP: <span className="text-lg">{publicIP ?? '—'}</span>
        </p>
        
        {/* Canvas: Real-time Ping Chart */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Real-time Ping</h4>
          <PingChart ping={ping} rtt={rtt} />
        </div>
      </div>
    </div>
  );
}
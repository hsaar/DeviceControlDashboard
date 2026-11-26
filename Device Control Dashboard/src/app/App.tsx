import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Dashboard from './components/Dashboard';
import ChannelControl from './components/ChannelControl';
import ChannelMatrix from './components/ChannelMatrix';

export interface Device {
  id: number;
  name: string;
  isOn: boolean;
  autoMode: boolean;
}

export interface ChannelData {
  id: number;
  devices: Device[];
}

function App() {
  const [channels, setChannels] = useState<ChannelData[]>(() => {
    // 10개 채널 초기화 (각 채널당 4개 디바이스)
    return Array.from({ length: 10 }, (_, channelIndex) => ({
      id: channelIndex + 1,
      devices: Array.from({ length: 4 }, (_, deviceIndex) => ({
        id: deviceIndex + 1,
        name: `Device ${deviceIndex + 1}`,
        isOn: false,
        autoMode: false,
      })),
    }));
  });

  const updateChannel = (channelId: number, updatedDevices: Device[]) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId
          ? { ...channel, devices: updatedDevices }
          : channel
      )
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard channels={channels} />} />
        <Route path="/matrix" element={<ChannelMatrix channels={channels} />} />
        <Route
          path="/channel/:id"
          element={
            <ChannelControl channels={channels} updateChannel={updateChannel} />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

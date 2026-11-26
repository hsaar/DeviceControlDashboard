import { Link } from 'react-router';
import { ChannelData } from '../App';
import { Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DashboardProps {
  channels: ChannelData[];
}

export default function Dashboard({ channels }: DashboardProps) {
  const getChannelStatus = (channel: ChannelData) => {
    const onDevices = channel.devices.filter(d => d.isOn).length;
    return { onDevices, totalDevices: channel.devices.length };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                ESP32 Device Controller
              </h1>
              <p className="text-gray-600">
                10 Channels · 40 Devices · WiFi Connected
              </p>
            </div>
            <Link
              to="/matrix"
              className="text-xs md:text-sm text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
            >
              Auto On 디바이스 매트릭스 보기
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {channels.map(channel => {
            const { onDevices, totalDevices } = getChannelStatus(channel);
            const allOn = onDevices === totalDevices;
            const allOff = onDevices === 0;

            return (
              <Link
                key={channel.id}
                to={`/channel/${channel.id}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        CH{channel.id}
                      </CardTitle>
                      {allOff ? (
                        <WifiOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Wifi
                          className={`h-5 w-5 ${
                            allOn ? 'text-green-500' : 'text-yellow-500'
                          }`}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span
                          className={`font-semibold ${
                            allOff
                              ? 'text-gray-500'
                              : allOn
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {onDevices}/{totalDevices} ON
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1">
                        {channel.devices.map(device => (
                          <div
                            key={device.id}
                            className={`h-8 rounded transition-colors ${
                              device.isOn
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                            title={`${device.name}: ${device.isOn ? 'ON' : 'OFF'}`}
                          />
                        ))}
                      </div>

                      <div className="text-xs text-gray-500 text-center pt-1">
                        Click to control
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
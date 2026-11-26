import { Link } from 'react-router';
import { ChannelData } from '../App';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface ChannelMatrixProps {
  channels: ChannelData[];
}

export default function ChannelMatrix({ channels }: ChannelMatrixProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Auto On 디바이스 Control
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              각 채널별 디바이스 ON/OFF 상태와 AUTO MODE 여부를 한눈에 확인하세요.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/">메인 대시보드로</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="space-y-2">
            {/* 상단 헤더: (채널 컬럼 비워두고) AUTO MODE 만 표시 */}
            <div className="grid grid-cols-[200px,1fr] items-center gap-4 text-xs font-semibold text-gray-600">
              <span />
              <span className="text-center">AUTO MODE</span>
            </div>

            {channels.map(channel => (
              <Link
                key={channel.id}
                to={`/channel/${channel.id}`}
                className="block"
              >
                <div className="grid grid-cols-[200px,1fr] items-center gap-4 rounded-md border border-dashed border-gray-200 bg-white px-3 py-2 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  {/* CH 라벨 + ON/OFF 블럭 (왼쪽 컬럼, 세로 배치) */}
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="text-sm font-semibold text-gray-800">
                      CH{channel.id}
                    </div>
                    <div className="flex justify-center gap-1">
                      {channel.devices.map(device => (
                        <div
                          key={device.id}
                          className={`h-6 w-6 border border-gray-300 ${
                            device.isOn ? 'bg-green-500' : 'bg-white'
                          }`}
                          title={`${device.name}: ${device.isOn ? 'ON' : 'OFF'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* AUTO MODE 라벨 아래 블럭 (오른쪽 컬럼) */}
                  <div className="flex justify-center gap-1">
                    {channel.devices.map(device => (
                      <div
                        key={device.id}
                        className={`h-6 w-6 border border-gray-300 ${
                          device.autoMode ? 'bg-sky-400' : 'bg-white'
                        }`}
                        title={`${device.name}: ${device.autoMode ? 'AUTO ON' : 'AUTO OFF'}`}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChannelData, Device } from '../App';
import { ArrowLeft, Power, Clock, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface ChannelControlProps {
  channels: ChannelData[];
  updateChannel: (channelId: number, updatedDevices: Device[]) => void;
}

export default function ChannelControl({
  channels,
  updateChannel,
}: ChannelControlProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const channelId = parseInt(id || '1');
  const channel = channels.find(c => c.id === channelId);

  const [devices, setDevices] = useState<Device[]>(channel?.devices || []);

  useEffect(() => {
    if (channel) {
      setDevices(channel.devices);
    }
  }, [channel]);

  if (!channel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Channel not found</p>
      </div>
    );
  }

  const handleTogglePower = (deviceId: number) => {
    const updated = devices.map(device =>
      device.id === deviceId ? { ...device, isOn: !device.isOn } : device
    );
    setDevices(updated);
    updateChannel(channelId, updated);
  };

  const handleToggleAuto = (deviceId: number) => {
    const updated = devices.map(device =>
      device.id === deviceId
        ? { ...device, autoMode: !device.autoMode }
        : device
    );
    setDevices(updated);
    updateChannel(channelId, updated);
  };

  const handleForceStop = (deviceId: number) => {
    const updated = devices.map(device =>
      device.id === deviceId
        ? { ...device, isOn: false, autoMode: false }
        : device
    );
    setDevices(updated);
    updateChannel(channelId, updated);
  };

  const handleAllOn = () => {
    const updated = devices.map(device => ({ ...device, isOn: true }));
    setDevices(updated);
    updateChannel(channelId, updated);
  };

  const handleAllOff = () => {
    const updated = devices.map(device => ({ ...device, isOn: false }));
    setDevices(updated);
    updateChannel(channelId, updated);
  };

  const handleForceStopAll = () => {
    const updated = devices.map(device => ({
      ...device,
      isOn: false,
      autoMode: false,
    }));
    setDevices(updated);
    updateChannel(channelId, updated);
  };

  const allOn = devices.every(device => device.isOn);
  const allOff = devices.every(device => !device.isOn);

  const handleToggleAllConfirm = () => {
    const targetOn = !allOn;
    const updated = devices.map(device => ({ ...device, isOn: targetOn }));
    setDevices(updated);
    updateChannel(channelId, updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

            <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Channel {channelId}
                </h1>
                <p className="mt-1 text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Control 4 devices
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-28 h-10 rounded-md border-2 text-sm font-semibold shadow-sm transition-colors bg-white border-gray-300 text-gray-800 hover:bg-gray-200 hover:border-gray-400 hover:text-gray-900"
                    >
                      {allOn ? 'All OFF' : 'All ON'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {allOn ? '모든 디바이스를 OFF로 전환할까요?' : '모든 디바이스를 ON으로 전환할까요?'}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {allOn
                          ? '현재 채널의 모든 디바이스가 ON 상태입니다. 모두 OFF로 전환합니다.'
                          : allOff
                          ? '현재 채널의 모든 디바이스가 OFF 상태입니다. 모두 ON으로 전환합니다.'
                          : '일부 디바이스만 ON 상태입니다. 모든 디바이스를 동일하게 전환합니다.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleToggleAllConfirm}>
                        확인
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-28 h-10 rounded-md border-2 text-sm font-semibold shadow-sm transition-colors bg-white border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400 hover:text-red-700"
                    >
                      Force Stop All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>모든 디바이스를 긴급 정지할까요?</AlertDialogTitle>
                      <AlertDialogDescription>
                        이 채널의 모든 디바이스의 전원을 끄고 자동 모드를 해제합니다. 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleForceStopAll}
                      >
                        긴급 정지
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        </div>

        {/* Device Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map(device => (
            <Card
              key={device.id}
              className={`transition-all ${
                device.isOn ? 'border-green-500 border-2' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{device.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {device.autoMode && (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Auto
                      </Badge>
                    )}
                    <Badge
                      variant={device.isOn ? 'default' : 'outline'}
                      className={
                        device.isOn
                          ? 'bg-green-500 hover:bg-green-600'
                          : ''
                      }
                    >
                      {device.isOn ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Auto Mode */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 tracking-wide">
                        AUTO MODE
                      </p>
                      <p className="text-xs font-medium text-gray-600">
                        Automatic on/off
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={device.autoMode}
                    onCheckedChange={() => handleToggleAuto(device.id)}
                  />
                </div>

                {/* Power Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Power
                      className={`h-5 w-5 ${
                        device.isOn ? 'text-green-500' : 'text-gray-400'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 tracking-wide">
                        POWER
                      </p>
                      <p className="text-xs font-medium text-gray-600">
                        Click to toggle
                      </p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-28 h-10 rounded-md border-2 text-sm font-semibold shadow-sm transition-colors bg-white border-gray-300 text-gray-800 hover:bg-gray-200 hover:border-gray-400 hover:text-gray-900"
                      >
                        Click
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {device.isOn
                            ? `${device.name} 전원을 OFF로 전환할까요?`
                            : `${device.name} 전원을 ON으로 전환할까요?`}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          현재 상태를 반대로 전환합니다. 계속 진행하시겠습니까?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleTogglePower(device.id)}
                        >
                          확인
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Force Stop */}
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-semibold text-red-700 tracking-wide">
                        FORCE STOP
                      </p>
                      <p className="text-xs font-medium text-red-600">
                        Emergency shutdown
                      </p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                      className="w-28 h-10 rounded-md border-2 text-sm font-semibold shadow-sm transition-colors bg-white border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400 hover:text-red-700"
                      >
                        STOP
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {device.name}을(를) 긴급 정지할까요?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          이 디바이스의 전원을 끄고 자동 모드를 해제합니다. 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleForceStop(device.id)}
                        >
                          긴급 정지
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
import { useNavigate } from 'react-router'
import Device from '../device/Device.tsx'
import { MessageScreen } from '../screen/Hud.tsx'

export default function NotFound() {
  const navigate = useNavigate()
  const home = () => navigate('/')
  return (
    <Device
      title="Not found"
      pad={{
        a: home,
        b: home,
        start: home,
        labels: { a: 'MENU', start: 'MENU' },
      }}
    >
      <MessageScreen title="404">
        THIS SCREEN DOESN&apos;T EXIST.
        <br />
        PRESS A FOR THE MENU.
      </MessageScreen>
    </Device>
  )
}

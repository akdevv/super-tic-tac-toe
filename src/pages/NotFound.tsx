import { useNavigate } from 'react-router'
import Device, { MessageScreen } from '../components/Device.tsx'

export default function NotFound() {
  const navigate = useNavigate()
  const home = () => navigate('/')
  return (
    <Device
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

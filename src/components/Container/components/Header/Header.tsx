import { useIsMobile } from '../../../../hooks'
import { MobileHeader, DesktopHeader } from './components'

export const Header: React.FC = () => {
  const isMobile = useIsMobile()

  return isMobile ? <MobileHeader /> : <DesktopHeader />
}

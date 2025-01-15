import { 
    FaCircle, 
    FaSignal, 
    FaWifi, 
    FaGlobe, 
    FaUsers, 
    FaGamepad,
    FaPowerOff
  } from "react-icons/fa";
  import { IconType } from "./Settings";
  
  export const getIconComponent = (iconType: IconType, color: string = '#4CAF50', size: number = 14) => {
    const iconProps = { color, size };
    
    switch (iconType) {
      case 'dot':
        return { component: FaCircle, props: iconProps };
      case 'signal':
        return { component: FaSignal, props: iconProps };
      case 'wifi':
        return { component: FaWifi, props: iconProps };
      case 'globe':
        return { component: FaGlobe, props: iconProps };
      case 'users':
        return { component: FaUsers, props: iconProps };
      case 'gamepad':
        return { component: FaGamepad, props: iconProps };
      case 'power':
        return { component: FaPowerOff, props: iconProps };
      default:
        return { component: FaCircle, props: iconProps };
    }
  };
  
  export const iconOptions = [
    { data: 'dot', label: 'Status Dot' },
    { data: 'signal', label: 'Signal Bars' },
    { data: 'wifi', label: 'WiFi Signal' },
    { data: 'globe', label: 'Globe' },
    { data: 'users', label: 'Users' },
    { data: 'gamepad', label: 'Gamepad' },
    { data: 'power', label: 'Power' }
  ];
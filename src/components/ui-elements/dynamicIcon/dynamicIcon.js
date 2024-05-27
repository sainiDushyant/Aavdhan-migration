import {
  TrendingUp,
  Cpu,
  Download,
  ZapOff,
  Calendar,
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  Bell,
  User,
  Grid,
  Activity,
  RefreshCw,
  MapPin,
  Sliders,
  Settings,
  Unlock,
  Circle,
  Award,
  FileText,
  Image,
  CreditCard,
  ArrowRight,
  Home,
} from 'react-feather';
import JsxParser from 'react-jsx-parser';

// Icon component to be apply dynamically
const IcoFun = (ico, size) => {
  return (
    <JsxParser
      components={{
        TrendingUp,
        Cpu,
        Download,
        ZapOff,
        Calendar,
        Check,
        ChevronRight,
        ChevronLeft,
        Clock,
        Bell,
        User,
        Grid,
        Activity,
        RefreshCw,
        MapPin,
        Sliders,
        Settings,
        Unlock,
        Circle,
        Award,
        FileText,
        Image,
        CreditCard,
        ArrowRight,
        Home,
      }}
      jsx={`<${ico} size={${size}} />`}
    />
  );
};

export default IcoFun;

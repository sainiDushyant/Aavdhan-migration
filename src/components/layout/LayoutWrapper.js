// import './App.css';
import { useState } from 'react';
import Drawer from './components/Drawer';
import Navbar from './components/Navbar';
import SideBar from './components/Navigator';
import '../../styles/layout.scss';
import Footer from '../../@core/layouts/components/footer';

function LayoutWrapper({ children }) {
  const [collapsed, setCollapsed] = useState();
  return (
    <div className="App">
      <Drawer SideBar={SideBar} />
      <div className="layout">
        <div className="aside border">
          <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <Navbar />
        <main>
          <div className="m-2">
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}

export default LayoutWrapper;

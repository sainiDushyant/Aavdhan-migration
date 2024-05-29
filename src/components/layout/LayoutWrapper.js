// import './App.css';
import Drawer from './components/Drawer';
import Navbar from './components/Navbar';
import SideBar from './components/Navigator';
import '../../styles/layout.scss';
import Footer from './components/Footer';

function LayoutWrapper({ children }) {
  return (
    <div className="App">
      <Drawer SideBar={SideBar} />
      <div className="layout">
        <div className="aside border">
          <SideBar />
        </div>
        <Navbar />
        <main>
          <div className="m-2">
            <div style={{ minHeight: '90vh' }}> {children}</div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}

export default LayoutWrapper;

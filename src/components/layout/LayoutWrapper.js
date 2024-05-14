// import './App.css';
import Drawer from './components/Drawer';
import Navbar from './components/Navbar';
import SideBar from './components/Navigator';
import '../../styles/layout.scss';
import Footer from '../../@core/layouts/components/footer';

function LayoutWrapper({ children }) {
  return (
    <div className="App">
      <Drawer SideBar={SideBar} />
      <div className="layout">
        <aside className="aside border">
          <SideBar />
        </aside>
        <Navbar />
        <main>
          <div className="m-2">{children}</div>
          <footer>
            <Footer />
          </footer>
        </main>
      </div>
    </div>
  );
}

export default LayoutWrapper;

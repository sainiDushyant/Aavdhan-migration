import { Navbar, NavbarBrand } from 'reactstrap';

function Header() {
  return (
    <header>
      <Navbar
        style={{ position: 'sticky', top: 0, width: 'auto', height: '20px' }}
      >
        <div className="d-flex justify-content-end w-100">
          <NavbarBrand href="/">
            <span className="text-dark">avdhaan</span>
          </NavbarBrand>
        </div>
      </Navbar>
    </header>
  );
}

export default Header;

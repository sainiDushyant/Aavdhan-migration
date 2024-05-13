import { Navbar, NavbarBrand } from 'reactstrap';

function Header() {
  return (
    <>
      <Navbar className="mb-2 fixed-top" color="white" dark>
        <div className="d-flex justify-content-end w-100">
          <NavbarBrand href="/">
            <span className="text-dark">avdhaan</span>
          </NavbarBrand>
        </div>
      </Navbar>
    </>
  );
}

export default Header;

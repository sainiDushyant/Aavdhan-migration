import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import '../@core/scss/base/pages/page-misc.scss';

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="misc-wrapper">
      <div
        className="brand-logo text-decoration-none l-0 d-flex align-items-center justify-content-center gap-2"
        onClick={(e) => {
          e.preventDefault();
          navigate('utility/lpdd/hes');
        }}
      >
        <img
          src={`polaris-logo.svg`}
          alt="Avdhaan"
          style={{ height: '30px', width: '30px' }}
        />
        <h1
          className="brand-text ml-1 pt-1"
          style={{ color: 'rgb(10,54,144)', fontFamily: 'sans-serif' }}
        >
          Avdhaan
        </h1>
      </div>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">Page Not Found 🕵🏻‍♀️</h2>
          <p className="mb-2">
            Oops! The requested URL was not found on this server.
          </p>
          <Button
            onClick={navigate('utility/lpdd/hes', { replace: true })}
            color="primary"
            className="btn-sm-block mb-2"
          >
            Back to home
          </Button>
          <img
            className="img-fluid"
            src={'error.svg'}
            alt="Not authorized page"
          />
        </div>
      </div>
    </div>
  );
};
export default Error;

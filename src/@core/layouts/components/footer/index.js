// ** Icons Import
import { Heart } from 'react-feather'

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-left d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a href='https://polarisgrids.com/' target='_blank' rel='noopener noreferrer'>
          Polaris
        </a>
        <span className='d-none d-sm-inline-block'>, All rights Reserved</span>
      </span>

      <small className='float-md-right'>
        Version : HES - <span className='text-dark'>1.2</span> | MDMS - <span className='text-dark'>0.0.0.5</span> | Billing System -{' '}
        <span className='text-dark'>0.0.0.5</span> | CIS/CRM -<span className='text-dark'>1.9.3</span>
      </small>
      {/* <span className='float-md-right d-none d-md-block'>
        Made with
        <Heart size={14} />
      </span> */}
    </p>
  )
}

export default Footer

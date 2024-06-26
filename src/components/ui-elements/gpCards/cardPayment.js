import Avatar from '../../../@core/components/avatar';
import { Card, CardBody, CardImg, Badge } from 'reactstrap';
import { Check } from 'react-feather';

const CardPayment = (props) => {
  return (
    <Card className="card-profile">
      <CardImg className="img-fluid" src={'banner-6.jpg'} top />
      <CardBody>
        <div className="profile-image-wrapper">
          <div className="profile-image">
            <Avatar img={'polaris-logo.svg'} />
          </div>
        </div>
        <h5 className="mb-2">{props.data.message}</h5>
        <h1>
          <Avatar
            color={
              props.data.status === 'success' ? 'light-success' : 'light-danger'
            }
            icon={<Check size={20} />}
          />{' '}
          Rs. {props.data.amount}
        </h1>
        <Badge className="profile-badge mb-2" color="light-primary">
          {props.data.consumer}
        </Badge>
        <h6 className="text-muted font-weight-bolder">
          {props.data.date} &nbsp; {props.data.time}
        </h6>
        <hr className="mb-2" />
        <div>
          <h2 className="text-center mb-2">Payment details</h2>
          <span>Receipt Number: &nbsp;</span>
          <span className="text-muted font-weight-bolder">
            {props.data.receipt}
          </span>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardPayment;

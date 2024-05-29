// ** Third Party Components
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';

const StatsVertical = ({
  icon,
  color,
  stats,
  statTitle,
  className,
  click,
  ...rest
}) => {
  return (
    <Card
      onClick={click}
      className={
        click ? 'cursor-pointer text-center' : 'cursor-default text-center'
      }
    >
      <CardBody className={className}>
        <h2 className="font-weight-bolder">{stats}</h2>
        <div
          className={`avatar p-50 m-0 mb-1 ${
            color ? `bg-light-${color}` : 'bg-light-primary'
          }`}
          style={click ? { cursor: 'pointer' } : { cursor: 'default' }}
        >
          <div className="avatar-content">{icon}</div>
        </div>
        <p className="card-text line-ellipsis">
          {statTitle}
          {/* {click ? <span className='text-right font-size-2 mr-2 arrow_position'>&#8594;</span> : ''} */}
        </p>
      </CardBody>
    </Card>
  );
};

export default StatsVertical;

// ** PropTypes
StatsVertical.propTypes = {
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  stats: PropTypes.string.isRequired,
  statTitle: PropTypes.string.isRequired,
  className: PropTypes.string,
};

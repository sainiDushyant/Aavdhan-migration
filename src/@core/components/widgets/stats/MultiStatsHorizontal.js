// ** Third Party Components
import PropTypes from 'prop-types'
import { Card, CardBody, Row, Col } from 'reactstrap'
import { useSelector } from 'react-redux'

const MultiStatsHorizontal = ({ icon, color, noBg, issubstring, strLen, stats, statTitle, className, click, clas, dvClas, avatar, ...rest }) => {
  const iconStore = useSelector(state => state.iconsStore)
  return (
    <Card onClick={click} className={click ? 'cursor-pointer' : 'cursor-default'}>
      <CardBody className={className}>
        <div className={`d-flex justify-content-between align-items-center ${dvClas ? dvClas : ''}`}>
          <Row className='w-100'>
            {JSON.parse(stats).map((val, index) => (
              <Col key={index}>
                <h2 className={`font-weight-bolder mb-0 ${clas}`} title={val.value}>
                  {issubstring && val.value.length > strLen ? `${val.value.substring(0, strLen)}... ` : val.value}
                </h2>
                <p className='card-text'>
                  {val.title}
                  {/* {click ? <span className='text-right font-size-2 mr-2 float-right'> &#8594;</span> : ''} */}
                </p>
              </Col>
            ))}
          </Row>
          {noBg ? (
            avatar ? (
              icon
            ) : (
              <div className={`avatar-content text-${color}`} style={click ? { cursor: 'pointer' } : { cursor: 'default' }}>
                {icon}
              </div>
            )
          ) : (
            <div
              className={`avatar avatar-stats p-50 m-0 ${color ? `bg-light-${color}` : 'bg-light-primary'}`}
              style={click ? { cursor: 'pointer' } : { cursor: 'default' }}>
              {avatar ? icon : <div className='avatar-content'>{icon}</div>}
              {/* color={iconStore.colors[Math.floor(Math.random() * iconStore.colors.length)]} */}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default MultiStatsHorizontal

// ** PropTypes
MultiStatsHorizontal.propTypes = {
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  stats: PropTypes.string.isRequired,
  // statTitle: PropTypes.string.isRequired,
  className: PropTypes.string
}

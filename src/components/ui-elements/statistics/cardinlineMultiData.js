import classnames from 'classnames';
import Avatar from '../../../@core/components/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Row,
  Col,
  Media,
} from 'reactstrap';
import IcoFun from '../dynamicIcon/dynamicIcon';
import { iconsStore as iconStore } from '../../../utils';

const CardinlineMultiData = (props) => {
  const renderData = () => {
    let data = props.data;
    const keyToRemove = 'title';
    const valueToRemove = 'Total Consumption';

    data = data.filter((item) => item[keyToRemove] !== valueToRemove);

    return data.map((item, index) => {
      const margin = Object.keys(props.cols);
      return (
        <Col key={index} {...props.cols} className="mb-2">
          <Media
            className="mb-1 mt-1 d-flex align-items-start"
            style={{ borderRight: '1px solid #ebe9f1 !important' }}
          >
            <Avatar
              color={
                iconStore.colors[
                  Math.floor(Math.random() * iconStore.colors.length)
                ]
              }
              icon={IcoFun(
                iconStore.icons[
                  Math.floor(Math.random() * iconStore.icons.length)
                ],
                24
              )}
              className="me-1"
              style={{ cursor: 'default' }}
            />
            <Media className="my-auto" body>
              <h4 className="font-weight-bolder mb-0">{item.value}</h4>
              <CardText className="font-small-3 mb-0">{item.title}</CardText>
              {/* <p className='text-right m-0 mr-2 font-size-2'>&#8594;</p> */}
            </Media>
          </Media>
        </Col>
      );
    });
  };

  return (
    <Card className="card-statistics">
      <CardHeader className="border-bottom p-1">
        <CardTitle tag="h4">Operational Statistics</CardTitle>
      </CardHeader>
      <CardBody className="p-2">
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  );
};

export default CardinlineMultiData;

import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Badge,
  Card,
  CardBody,
  Button,
} from 'reactstrap';
import StatsHorizontal from '../../../../../../@core/components/widgets/stats/StatsHorizontal';

import { FileText } from 'react-feather';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Loader from '../../../../../../components/loader/loader';

import moment from 'moment';

import { useLocation } from 'react-router-dom';
import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';
import './wrapper.css';
import { useGetUserBillingHistoryQuery } from '../../../../../../api/mdms/userConsumptionSlice';

const GeneratedBillsWrapper = (props) => {
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const [centeredModal, setCenteredModal] = useState(false);
  const [jsonModal, setJsonModal] = useState(false);
  const [fetchBillingHistory, setFetchBillingHistoryData] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);
  const [billURL, setBillURL] = useState();

  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );

  const currentMonth = moment().format('MM');
  const currentYear = moment().format('YYYY');
  const project = location.pathname.split('/')[2];

  const params = {
    project: project,
    substation: HierarchyProgress.pss_name,
    feeder: HierarchyProgress.feeder_name,
    dtr: HierarchyProgress.dtr_name,
    sc_no: HierarchyProgress.user_name,
    year: currentYear,
    month: currentMonth,
  };

  const { isFetching, data, isError, status, refetch } =
    useGetUserBillingHistoryQuery(params);

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        setFetchBillingHistoryData(false);
        setBillingHistory(data.data.result.stat);

        if (data.data.result.stat.length > 0) {
          setBillURL(data.data.result.stat[0].billURL);
        }
      }
    } else if (isError) {
      setErrorMessage('Something went wrong, please retry.');
    }
  }, [data, status, isError]);

  const handleBillClicked = (url) => {
    setBillURL(url);
  };

  const handleModalOpenHandler = () => {
    setCenteredModal(!centeredModal);
    setFetchBillingHistoryData(true);
  };
  const retryAgain = () => {
    refetch();
  };

  return (
    <>
      <StatsHorizontal
        icon={<FileText size={21} />}
        color="info"
        stats="Generated Bills"
        statTitle=""
        click={() => setCenteredModal(!centeredModal)}
        clas="h4"
        dvClas={props.dvClas ? props.dvClas : ''}
      />
      <Modal
        isOpen={centeredModal}
        toggle={() => handleModalOpenHandler(!centeredModal)}
        scrollable
        className="modal_size h-100"
      >
        <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
          Generated bills
        </ModalHeader>
        {isError ? (
          <div className="p-2">
            <CardInfo
              props={{
                message: { errorMessage },
                retryFun: { retryAgain },
                retry: { isFetching },
              }}
            />
          </div>
        ) : (
          <>
            {isFetching ? (
              <Loader hight="min-height-601" />
            ) : (
              <ModalBody>
                {billingHistory.length > 0 ? (
                  <Row>
                    <Col lg="4" xs="5" className="recharge-col-height">
                      {billingHistory.map((i, index) => (
                        <Card
                          onClick={() => handleBillClicked(i.billURL)}
                          className="cursor-pointer"
                          key={index}
                        >
                          <CardBody className="px_5">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <p className="font-weight-bolder">
                                  Billing month: {i.billingMonth}
                                </p>
                                {/* <p className='font-weight-bolder'>Billing date: {i.billingDate}</p>
                          <p className={`mb-0`}>Start date: {i.startDate}</p>
                          <p className='card-text mb-0'>End date: {i.endDate}</p> */}
                                <p className="card-text mb-0">
                                  Bill number : {i.billNo}
                                </p>
                              </div>
                              <div
                                className={`avatar avatar-stats p-50 m-0 bg-transparent`}
                              >
                                <Badge color="light-primary">
                                  Rs.{i.amount}
                                </Badge>
                              </div>
                              {/* <Button.Ripple className='btn-sm' color='primary' outline onClick={setJsonModal}>
                            XML
                          </Button.Ripple> */}
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </Col>
                    <Col lg="8" xs="7">
                      <iframe
                        src={billURL}
                        title="title"
                        className="w-100 h-100"
                      ></iframe>
                    </Col>
                  </Row>
                ) : (
                  <div className="super-center min-height-527">
                    <div className="d-flex flex-column align-items-center">
                      <img
                        src={'no_data.svg'}
                        style={{ height: '150px', width: '150px' }}
                      />
                      <p className="mt-1 ml-3">No data found</p>
                    </div>
                  </div>
                )}
              </ModalBody>
            )}
          </>
        )}
      </Modal>

      <Modal
        isOpen={jsonModal}
        toggle={() => setJsonModal(!jsonModal)}
        scrollable
        className="modal-md"
      >
        <ModalHeader toggle={() => setJsonModal(!jsonModal)}>
          Raw data of bill
        </ModalHeader>
        <ModalBody>XML will show here</ModalBody>
      </Modal>
    </>
  );
};

export default GeneratedBillsWrapper;

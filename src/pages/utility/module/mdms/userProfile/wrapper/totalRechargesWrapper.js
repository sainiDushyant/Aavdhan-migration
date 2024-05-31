import {
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
// String to icon tag
import IcoFun from '../../../../../../components/ui-elements/dynamicIcon/dynamicIcon';
import RawFun from './rechargeHistoryWrapper';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CardPayment from '../../../../../../components/ui-elements/gpCards/cardPayment';
import './wrapper.css';

import Loader from '../../../../../../components/loader/loader';

import { useLocation } from 'react-router-dom';
import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';
import moment from 'moment';
import {
  useGetUserWalletInfoQuery,
  useLazyGetUserRechargeHistoryQuery,
} from '../../../../../../api/mdms/userConsumptionSlice';

const TotalRechargesWrapper = () => {
  const location = useLocation();

  const [errorMessage, setErrorMessage] = useState('');

  const [centeredModal, setCenteredModal] = useState(false);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [rechargeReceipt, setRechargeReceipt] = useState({});
  const [userWalletInfo, setUserWalletInfo] = useState([]);

  // const dispatch = useDispatch()
  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );

  const currentMonth = moment().format('MM'); // Month number, e.g., "05"
  const currentYear = moment().format('YYYY');

  const [fetchRechargeHistory, rechargeHistoryResonse] =
    useLazyGetUserRechargeHistoryQuery();

  const project =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];

  const params = {
    project: project,
    substation: HierarchyProgress.pss_name,
    feeder: HierarchyProgress.feeder_name,
    dtr: HierarchyProgress.dtr_name,
    sc_no: HierarchyProgress.user_name,
    year: currentYear,
    month: currentMonth,
  };

  const { isFetching, status, isError, data, refetch } =
    useGetUserWalletInfoQuery(params);

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode) {
        if (statusCode === 200) {
          setUserWalletInfo(data.data.result.stat);
        }
      }
    } else if (isError) {
      setErrorMessage('Something went wrong, please try again.');
    }
  }, [data, isError, status]);

  useEffect(() => {
    if (centeredModal) {
      fetchRechargeHistory(params, { preferCacheValue: true });
    }
  }, [centeredModal]);

  useEffect(() => {
    if (rechargeHistoryResonse.status === 'fulfilled') {
      let statusCode = rechargeHistoryResonse.currentData.responseCode;
      if (statusCode === 200) {
        setRechargeHistory(rechargeHistoryResonse.currentData.data.result.stat);
        setRechargeReceipt(
          rechargeHistoryResonse.currentData.data.result.stat[0]
        );
      }
    } else if (rechargeHistoryResonse.isError) {
      setErrorMessage('Something went wrong, please retry.');
    }
  }, [rechargeHistoryResonse]);

  const handleRechargeItemClicked = (position) => {
    setRechargeReceipt(rechargeHistory[position]);
  };
  const retryAgain = () => {
    refetch();
  };

  return (
    <>
      {/* <StatsHorizontal icon={IcoFun('FileText', 21)} color='warning' stats={rawData.statistics} statTitle={rawData.title} /> */}
      <Card>
        {isError ? (
          <div>
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
            {isFetching && <Loader hight="min-height-128" />}
            {!isFetching && (
              <CardBody
                className="cursor-pointer"
                onClick={() => setCenteredModal(!centeredModal)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="font-weight-bolder mb-0">
                      {userWalletInfo[0]?.value}
                    </h2>
                    <p className="card-text mb-2">{userWalletInfo[0]?.title}</p>
                    <h2 className="font-weight-bolder mb-0">
                      {userWalletInfo[1]?.value}
                    </h2>
                    <p className="card-text">{userWalletInfo[1]?.title}</p>
                  </div>
                  <div className={`avatar avatar-stats p-50 m-0`}>
                    <div className="avatar-content">
                      {IcoFun('FileText', 21)}
                    </div>
                  </div>
                </div>
              </CardBody>
            )}
          </>
        )}
      </Card>

      <Modal
        isOpen={centeredModal}
        toggle={() => setCenteredModal(!centeredModal)}
        scrollable
        className="modal_size h-100"
      >
        <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
          Recharge History
        </ModalHeader>
        {rechargeHistoryResonse.isError ? (
          <div className="p-2">
            <CardInfo
              props={{
                message: { errorMessage },
                retryFun: { retryAgain },
                retry: { retry: rechargeHistoryResonse.isFetching },
              }}
            />
          </div>
        ) : (
          <>
            {!rechargeHistoryResonse.isFetching && (
              <ModalBody>
                {rechargeHistory.length > 0 ? (
                  <Row>
                    <Col lg="4" xs="6" className="recharge-col-height">
                      <RawFun
                        data={rechargeHistory}
                        handleRechargeItemClicked={handleRechargeItemClicked}
                      />
                    </Col>
                    <Col lg="8" xs="6">
                      <Row className="justify-content-center">
                        <Col lg="6" xs="12">
                          <CardPayment data={rechargeReceipt} />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ) : (
                  <div className="super-center h-100">
                    <div className="d-flex flex-column align-items-center justify-content-center">
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
    </>
  );
};

export default TotalRechargesWrapper;

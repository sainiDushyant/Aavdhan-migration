import React, { useState, Fragment, useEffect } from 'react';
import { ListGroup, ListGroupItem, Spinner, Row, Col } from 'reactstrap';
import { RefreshCw } from 'react-feather';
import { Loader } from 'react-feather';
import { useSelector } from 'react-redux';

import { useLocation } from 'react-router-dom';
import CardInfo from '../../cards/cardInfo';
import { useGetAssetHierarchyWiseSystemAlertsQuery } from '../../../../api/mdms/userConsumptionSlice';

const SystemGeneratedAlert = (props) => {
  const location = useLocation();
  const project =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];

  // Error Handling
  const [errorMessage, setErrorMessage] = useState('');

  const [refresh, setRefresh] = useState(false);

  const [response, setResponse] = useState([]);
  // const dispatch = useDispatch()
  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );

  const params = {
    project: project,
    sc_no: HierarchyProgress.user_name,
  };

  const { data, isFetching, isError, status, refetch } =
    useGetAssetHierarchyWiseSystemAlertsQuery(params);

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        setResponse(data.data.result.stat);
      }
    } else if (isError) {
      setErrorMessage('Something went wrong, please retry');
    }
  }, [data, status, isError]);

  const retryAgain = () => {
    refetch();
  };

  if (isError) {
    return (
      <Col xl="12" md="6" xs="12" className="mt-3 ">
        <CardInfo
          props={{
            message: { errorMessage },
            retryFun: { retryAgain },
            retry: { isFetching },
          }}
        />
      </Col>
    );
  } else if (!isFetching) {
    if (response.length > 0) {
      return (
        <div>
          <Row className="mb-1">
            <Col className="pl_30"></Col>
            <Col className="col-md-2 pr-3">
              {/* Refresh Icon */}
              <Fragment>
                {refresh ? (
                  <Spinner
                    id="refresh_table"
                    size="sm"
                    className="mt_10 float-end me-1"
                  />
                ) : (
                  <RefreshCw
                    id="refresh_table"
                    size="14"
                    className="mt_10 float-end me-1"
                    onClick={refetch}
                  />
                )}
              </Fragment>
            </Col>
          </Row>
          <ListGroup className={`${props.height} webi_scroller`}>
            {response.map((value, index) => {
              return (
                <ListGroupItem key={index}>
                  <h5 className="mb-0">{value.title}</h5>
                  <small className="float-right">{value.time}</small>
                  <br></br>
                  <p className="mb-1">{value.message}</p>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </div>
      );
    } else {
      return (
        <div>
          <Row className="mb-1">
            <Col className="pl_30"></Col>
            <Col className="col-md-2 pr-3">
              {/* Refresh Icon */}
              <Fragment>
                {isFetching ? (
                  <Spinner
                    id="refresh_table"
                    size="sm"
                    className="mt_10 float-end me-1"
                  />
                ) : (
                  <RefreshCw
                    id="refresh_table"
                    size="14"
                    className="mt_10 float-end me-1"
                    onClick={refetch}
                  />
                )}
              </Fragment>
            </Col>
          </Row>
          <div className="super-center alert_dv">
            <div className="d-flex flex-column align-items-center">
              <img
                src={'no_data.svg'}
                style={{ height: '150px', width: '150px' }}
              />
              <p className="mt-1 ml-3">No data found</p>
            </div>
          </div>
        </div>
      );
    }
  } else if (isFetching) {
    return (
      <div className={`super-center alert_dv ${props.loaderHeight}`}>
        <Loader />
      </div>
    );
  }
};

export default SystemGeneratedAlert;

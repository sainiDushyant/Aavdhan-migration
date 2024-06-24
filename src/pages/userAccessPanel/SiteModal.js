import React, { useState, useEffect } from 'react';
import {
  Button,
  FormGroup,
  Label,
  ModalBody,
  ModalFooter,
  Spinner,
} from 'reactstrap';
import Select from 'react-select';
import { selectThemeColors } from '../../utils';
import { useCommandInfoAssetsQuery } from '../../api/hes/drop-downSlice';
import { toast } from 'react-toastify';

const SiteModal = (props) => {
  const [loader, setLoader] = useState(false);

  const vertical = props.rowSelectedToEdit.vertical;
  const project = props.rowSelectedToEdit.project;
  const projectLevelSiteAccess = props.projectLevelSiteAccess;

  const filterSite = (site) => {
    if (site.project) {
      return (
        site.project === props.rowSelectedToEdit.project &&
        site.vertical === props.rowSelectedToEdit.vertical
      );
    } else {
      return [];
    }
  };
  const [siteSelected, setSiteSelected] = useState(
    props.projectLevelSiteAccess.filter(filterSite)[0].site_access
  );
  // console.log(siteSelected)
  const [siteSelectionOptions, setSiteSelectionOptions] = useState([]);

  const params = {};

  params['project'] =
    props.rowSelectedToEdit.project.toLowerCase() === 'sbpdcl'
      ? 'ipcl'
      : props.rowSelectedToEdit.project;
  params['vertical'] = props.rowSelectedToEdit.vertical;
  const { data, isFetching, isError, status, refetch } =
    useCommandInfoAssetsQuery(params);

  useEffect(() => {
    if (status === 'fulfilled') {
      // Create Data for Asset
      const pss_list = [];
      const feeder_list = [];
      const dtr_list = [];
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        const newData = data.data.result.stat;
        // Create pss list
        // const pss_list = []
        for (const pss of newData['pss_list']) {
          const temp = {};
          temp['pss_name'] = pss['pss_name'];
          temp['pss_id'] = pss['pss_id'];

          pss_list.push(temp);
        }

        // Create Feeder list
        // const feeder_list = []
        for (const feeder of newData['feeder_list']) {
          const temp = {};
          const parent_pss = feeder['pss_id'];
          for (const pss of pss_list) {
            if (pss['pss_id'] === parent_pss) {
              temp['feeder_name'] = feeder['feeder_name'];
              temp['feeder_id'] = feeder['feeder_id'];
              temp['pss_name'] = pss['pss_name'];
              temp['pss_id'] = pss['pss_id'];
              feeder_list.push(temp);
            }
          }
        }

        // Create DTR List
        // const dtr_list = []
        for (const dtr of newData['live_dt_list']) {
          const temp = {};
          const parent_feeder = dtr['feeder_id'];
          for (const feeder of feeder_list) {
            if (feeder['feeder_id'] === parent_feeder) {
              temp['feeder_name'] = feeder['feeder_name'];
              temp['feeder_id'] = feeder['feeder_id'];
              temp['pss_name'] = feeder['pss_name'];
              temp['pss_id'] = feeder['pss_id'];
              temp['dtr_name'] = dtr['site_name'];
              temp['dtr_id'] = dtr['site_id'];
              temp['label'] = dtr['site_name'];
              temp['value'] = dtr['site_id'];
              temp['project'] = params.project;
              dtr_list.push(temp);
            }
          }
        }
      }
      setSiteSelectionOptions(dtr_list);
    } else if (isError) {
      toast(
        <>
          Error fetching list...
          <Button
            style={{
              width: '100px',
              height: '30px',
              backgroundColor: '#7367f0',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={refetch}
          >
            Retry
          </Button>
        </>,
        {
          hideProgressBar: true,
          type: 'error',
          closeOnClick: true,
          autoClose: false,
        }
      );
    }
  }, [data, isError, status]);

  const onSiteSelectionUpdation = (data) => {
    // console.log('Site Selection Updation ....')
    // console.log(data)
    if (data) {
      setSiteSelected(data);
    } else {
      setSiteSelected([]);
    }
  };

  const onUpdate = () => {
    // console.log(projectLevelSiteAccess)
    for (let i = 0; i < projectLevelSiteAccess.length; i++) {
      if (
        projectLevelSiteAccess[i].vertical === vertical &&
        projectLevelSiteAccess[i].project === project
      ) {
        // console.log(i)
        projectLevelSiteAccess.splice(i, 1);
      }
    }
    const newTemp = {
      vertical,
      project,
      site_access: siteSelected,
    };
    // console.log(newTemp)
    projectLevelSiteAccess.push(newTemp);
    props.updateSiteAccessData(projectLevelSiteAccess);
  };

  return (
    <>
      <ModalBody>
        {/* <div className='mb-2'>
              <TagsInput tags={selectedModuleValue} />
            </div> */}
        <div className="mx-1">
          {siteSelected && siteSelected.length === 0 ? (
            <span className="text-danger "> *All sites are selected</span>
          ) : (
            ''
          )}
          <FormGroup className="mt-1">
            <Label>Sites</Label>

            <Select
              isClearable={false}
              theme={selectThemeColors}
              value={siteSelected}
              //   key={`my_unique_select_key__${selected}`}
              isMulti
              name="colors"
              options={siteSelectionOptions}
              className="react-select"
              classNamePrefix="select"
              closeMenuOnSelect={false}
              onChange={onSiteSelectionUpdation}
              placeholder={'Select Sites *'}
              isLoading={isFetching}
              required
            />
          </FormGroup>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            onUpdate();
          }}
        >
          update
        </Button>
      </ModalFooter>
    </>
  );
};

export default SiteModal;

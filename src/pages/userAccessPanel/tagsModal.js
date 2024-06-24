import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  ModalBody,
  ModalFooter,
  Spinner,
} from 'reactstrap';
import Select from 'react-select';
import { selectThemeColors } from '../../utils';
import { useLazyGetTagsListQuery } from '../../api/user-access-panel';
import { toast } from 'react-toastify';

const TagsModal = (props) => {
  const vertical = props.rowSelectedToEdit.vertical;
  const project = props.rowSelectedToEdit.project;
  const projectLevelTagsAccess = props.projectLevelTagsAccess;

  const [tagsSelectionOptions, setTagsSelectionOptions] = useState([]);
  const [fetchTagList, tagListResponse] = useLazyGetTagsListQuery();

  const params = {};

  params['project'] = project;

  useEffect(() => {
    fetchTagList(params, { preferCacheValue: true });
  }, []);

  useEffect(() => {
    if (tagListResponse.status === 'fulfilled') {
      if (tagListResponse.currentData.responseCode === 200) {
        const data = tagListResponse.currentData.data.result
          .filter((ele) => ele.project === project)
          .map((ele) => ({
            value: ele.tag,
            label: ele.tag,
          }));

        setTagsSelectionOptions(data);
      }
    } else if (tagListResponse.isError) {
      toast(
        <>
          {tagListResponse.error.status === 406 ? (
            tagListResponse.error.data.data.error.detail
          ) : (
            <>
              Error fetching tags list...
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
                onClick={() => fetchTagList(params)}
              >
                Retry
              </Button>
            </>
          )}
        </>,
        {
          hideProgressBar: true,
          type: 'error',
          closeOnClick: true,
          autoClose: tagListResponse.error.status === 406 ? true : false,
        }
      );
    }
  }, [tagListResponse]);

  const filterTags = (tags) => {
    if (tags.project) {
      return (
        tags.project === props.rowSelectedToEdit.project &&
        tags.vertical === props.rowSelectedToEdit.vertical
      );
    } else {
      return [];
    }
  };

  const [tagsSelected, setTagsSelected] = useState(
    projectLevelTagsAccess?.filter(filterTags)[0]?.tag_access
  );

  const onTagsSelectionUpdation = (data) => {
    if (data) {
      setTagsSelected(data);
    } else {
      setTagsSelected([]);
    }
  };

  const onUpdate = () => {
    for (let i = 0; i < projectLevelTagsAccess.length; i++) {
      if (
        projectLevelTagsAccess[i].vertical === vertical &&
        projectLevelTagsAccess[i].project === project
      ) {
        projectLevelTagsAccess.splice(i, 1);
      }
    }
    const newTemp = {
      vertical,
      project,
      tag_access: tagsSelected,
    };

    projectLevelTagsAccess.push(newTemp);
    props.updateTagsAccessData(projectLevelTagsAccess);
  };

  return (
    <>
      <ModalBody>
        {/* <div className='mb-2'>
              <TagsInput tags={selectedModuleValue} />
            </div> */}
        <div className="mx-1">
          {(tagsSelected && tagsSelected.length === 0) ||
          typeof tagsSelected === 'undefined' ? (
            <span className="text-danger "> *All Tags are selected</span>
          ) : (
            ''
          )}
          <FormGroup className="mt-1">
            <Label>Tags</Label>

            <Select
              isClearable={false}
              theme={selectThemeColors}
              value={tagsSelected}
              isLoading={tagListResponse.isLoading}
              isMulti
              name="colors"
              options={tagsSelectionOptions}
              className="react-select"
              classNamePrefix="select"
              closeMenuOnSelect={false}
              onChange={onTagsSelectionUpdation}
              placeholder={'Select Tags *'}
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
          Update
        </Button>
      </ModalFooter>
    </>
  );
};

export default TagsModal;

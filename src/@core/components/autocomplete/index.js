// ** React Imports
import { useState, useRef } from 'react';

// ** Third Party Components
import PropTypes from 'prop-types';

// ** Styles
import '../../scss/base/bootstrap-extended/_include.scss';
import './autocomplete.scss';

const Autocomplete = (props) => {
  // ** Refs
  const container = useRef(null);
  const [userInput, setUserInput] = useState('');

  // ** Input On Change Event
  const onChange = (e) => {
    const userInput = e.currentTarget.value;
    // setActiveSuggestion(0)
    // setShowSuggestions(true)
    setUserInput(userInput);
    props.userInputFun(userInput);
    // if (e.target.value < 1) {
    //   setShowSuggestions(false)
    // }
  };

  // ** Input's Keydown Event
  const onKeyDown = (e) => {
    // ** Custom Keydown Event
    if (props.onKeyDown !== undefined && props.onKeyDown !== null) {
      props.onKeyDown(e, userInput);
    }
  };

  return (
    <div className="autocomplete-container" ref={container}>
      <input
        type="text"
        onChange={(e) => {
          onChange(e);
        }}
        onKeyDown={(e) => onKeyDown(e)}
        value={userInput}
        className={`autocomplete-search ${
          props.className ? props.className : ''
        }`}
        placeholder={props.placeholder}
        autoFocus={props.autoFocus}
        // onBlur={e => {
        //   if (props.onBlur) props.onBlur(e)
        //   setFocused(false)
        // }}
      />
    </div>
  );
};

export default Autocomplete;

// ** PropTypes
Autocomplete.propTypes = {
  suggestions: PropTypes.array,
  filterKey: PropTypes.string,
  defaultValue: PropTypes.string,
  wrapperClass: PropTypes.string,
  filterHeaderKey: PropTypes.string,
  placeholder: PropTypes.string,
  suggestionLimit: PropTypes.number,
  grouped: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onKeyDown: PropTypes.func,
  onSuggestionsShown: PropTypes.func,
  onSuggestionItemClick: PropTypes.func,
  clearInput: PropTypes.func,
  externalClick: PropTypes.func,
};

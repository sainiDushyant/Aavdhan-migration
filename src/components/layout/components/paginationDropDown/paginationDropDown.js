import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
const PaginationDropDown = ({ rowCount, setRowCount, disabled, disabledCounts}) => {
  const items = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
  ];
  return (
    <div className="me-1">
      <UncontrolledDropdown direction="down" >
        <DropdownToggle caret color="primary" size="sm">
          {rowCount}
        </DropdownToggle>
        <DropdownMenu className="px-3">
          {items.map((item) => (
            <DropdownItem
              key={item.label}
              onClick={() => setRowCount(item.value)}
              disabled={disabled || disabledCounts?.includes(item.value)}
            >
              {item.value}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};
export default PaginationDropDown;

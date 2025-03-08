import SelectMUI from '@mui/material/Select' ;
import MenuItemMUI from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {SelectProps, styled } from '@mui/material';

interface Item {
  value: number;
  label: string;
}

interface Props {
  onChange: (event: any) => void;
  list: Item[];
}

const SelectItem = styled(SelectMUI)<SelectProps>(({ theme }) => ({
  backgroundColor: 'white',
  fontFamily: 'Roboto',
  border: '2px solid #2f2f2f',
  borderRadius: '0px',
  // boxShadow: '3px 3px 0px #2f2f2f',
  color: '#2f2f2f',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover': {
    backgroundColor: '#e8e4d9',
  },
  '&.Mui-focused': {
    // backgroundColor: '#e8e4d9',
    border: '2px solid #2f2f2f',
    boxShadow: '2px 2px 0pxrgb(255, 255, 255)',
  },
  // Style for the dropdown icon
  '& .MuiSelect-icon': {
    color: '#2f2f2f',
  },
  '& .MuiSelect-select': {
    textAlign: 'center',
  },
}));

const MenuItem = styled(MenuItemMUI)({
  fontFamily: 'Roboto',
  '&:hover': {
    // backgroundColor: '#e8e4d9',
  },
  '&.Mui-selected': {
    backgroundColor: 'white !important',
    color: '#2f2f2f',
  },
});


const Select = ({onChange, list}: Props) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 200 }}>
      <SelectItem
        defaultValue={0}
        displayEmpty
        sx={{ height: 45 }}
        onChange={onChange}
      >
        {/* <MenuItem value="">
          <em>Select Option</em>
        </MenuItem> */}
        {list.map((item, index) => (
          <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
        ))}
      </SelectItem>
    </FormControl>
  );
}

export default Select;
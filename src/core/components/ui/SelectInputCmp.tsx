import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  type SelectProps
} from '@mui/material';

interface SelectInputProps<T extends FieldValues> extends Omit<SelectProps, 'name'>
{
  name        : Path<T>;
  control     : Control<T>;
  options     : { value: string | number; label: string }[];
  helperText? : string; // Optional custom helper text
}

function SelectInputCmp<T extends FieldValues>(
{
  name,
  control,
  options,
  label,
  helperText,
  ...props // Spreads MUI SelectProps (variant, size, sx, etc.)
}: SelectInputProps<T>)
{
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (

        <FormControl
          fullWidth={props.fullWidth}
          error={!!error}
          margin={props.margin || "normal"}
          sx={props.sx}
        >
          {/* We only render the label if it's provided */}
          {label && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
          
          <Select
            {...field}
            {...props}
            labelId={`${name}-label`}
            label={label} // Important: MUI needs this here too for the notch in the border
          >
            {options.map((opt) => (
              <MenuItem
              key={opt.value} value={opt.value}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          {/* Show RHF error or the custom helperText */}
          {(error || helperText) && (
            <FormHelperText>{error ? error.message : helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

export default SelectInputCmp;

import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { TextField, type TextFieldProps } from '@mui/material';

// We use Generics <T> so the 'name' prop is type-safe based on the Form Schema.
interface FormTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'>
{
  name    : Path<T>;    // The name for the react-hook-form.
  control : Control<T>; // The react-hook-form control object.
}


function TextInputCmp <T extends FieldValues>({
  name,    // The react-hook-form control name.
  control, // The react-hook-form control object.
  ...props // Spread this for MUI and custom props.
}: FormTextFieldProps<T>)
{
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
      (
        <TextField
          {...field}      // RHF: onChange, onBlur, value, ref
          {...props}      // MUI: label, variant, multiline, etc.
          error={!!error}
          helperText={error ? error.message : props.helperText}
          fullWidth
          margin="normal"
        />
      )}
    />
  );
};

export default TextInputCmp;


import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Box, Container, Paper, Typography } from '@mui/material';
import TextInputCmp from '@/core/components/ui/TextInputCmp';
import { useTranslation } from 'react-i18next';

export type LoginDataType =
{
  email   : string,
  password: string
}

type LoginProps =
{
  onLoginFormSubmit: (data: LoginDataType) => Promise<void>
};


function LoginUI(props: LoginProps)
{
  const {t} = useTranslation();

  const schema = useMemo(()=>yup.object(
  {
    email   : yup
    .string()
    .email(t('login.email.invalid'))
    .required(t('required')),

    password: yup
    .string()
    .required(t('required'))
    .min(8, t('login.password.min'))
    .matches(/[A-Z]/, t('login.password.uppercase'))      // 1 capital letter
    .matches(/[0-9]/, t('login.password.number'))         // 1 number
    .matches(/[!@#$%^&*]/, t('login.password.special')),  // 1 special symbol

  }).required(), [t]);


  const {
    control,
    handleSubmit,
    formState
  } = useForm(
  {
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange'
  });

  return (

    <Box
    sx=
    {{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', minHeight: '100vh'
    }}
    >
      <Container
      maxWidth="xs"
      sx={
      { mt: 8
      }}
      >

        <Paper
        sx={
        { p: 4
        }}
        >

          <Typography
          variant="h5" gutterBottom
          sx=
          {{
            textAlign: "center"
          }}
          >
            {t('login.title')}
          </Typography>

          <Box
          component="form"
          aria-label={t('login.aria_label')}
          onSubmit=
          {
            handleSubmit(props.onLoginFormSubmit)
          }
          >
            <TextInputCmp
              name="email"
              label={t('login.email.label')}
              placeholder={t('login.email.placeholder')}
              aria-label={t('login.email.aria_label')}
              control={control}
            />

            <TextInputCmp
              name="password"
              label={t('login.password.label')}
              placeholder={t('login.password.placeholder')}
              aria-label={t('login.password.aria_label')}
              type="password"
              control={control}
            />

            <Button
            type="submit"
            variant="contained"
            aria-label={t('login.submit_btn.aria_label')}
            disabled={!formState.isValid}
            fullWidth
            sx=
            {{
              mt: 3
            }}>
              {t('login.submit_btn.submit')}
            </Button>

          </Box>

        </Paper>

      </Container>

    </Box>
  );
};

export default LoginUI;


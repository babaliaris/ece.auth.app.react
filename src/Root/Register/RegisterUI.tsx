import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Box, Container, Paper, Typography } from '@mui/material';
import TextInputCmp from '@/core/components/ui/TextInputCmp';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ECE_ROUTE_PATHS } from '@/core/routes';

export type RegisterDataType =
{
  email           : string,
  password        : string
  password_repeat : string
}

type LoginProps =
{
  onRegisterFormSubmit: (data: RegisterDataType) => Promise<void>
};


function RegisterUI(props: LoginProps)
{
  const {t}       = useTranslation();
  const navigate  = useNavigate();

  const schema = useMemo(()=>yup.object(
  {
    email   : yup
    .string()
    .email(t('register.email.invalid'))
    .required(t('required')),

    password: yup
    .string()
    .required(t('required'))
    .min(8, t('register.password.min'))
    .matches(/[A-Z]/, t('register.password.uppercase'))      // 1 capital letter
    .matches(/[0-9]/, t('register.password.number'))         // 1 number
    .matches(/[!@#$%^&*]/, t('register.password.special')),  // 1 special symbol

    password_repeat: yup
    .string()
    .required(t('required'))
    .oneOf([yup.ref('password')], t('register.password_repeat.invalid'))

  }).required(), [t]);


  const {
    control,
    handleSubmit,
    formState
  } = useForm(
  {
    resolver: yupResolver(schema),
    defaultValues:
    {
      email: '', password: '',
      password_repeat: ''
    },
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
            {t('register.title')}
          </Typography>

          <Box
          component="form"
          aria-label={t('register.aria_label')}
          onSubmit=
          {
            handleSubmit(props.onRegisterFormSubmit)
          }
          >
            <TextInputCmp
              name="email"
              autoComplete='email'
              label={t('register.email.label')}
              placeholder={t('register.email.placeholder')}
              aria-label={t('register.email.aria_label')}
              control={control}
            />

            <TextInputCmp
              name="password"
              autoComplete='new-password'
              label={t('register.password.label')}
              placeholder={t('register.password.placeholder')}
              aria-label={t('register.password.aria_label')}
              type="password"
              control={control}
            />

            <TextInputCmp
              name="password_repeat"
              autoComplete='new-password'
              label={t('register.password_repeat.label')}
              placeholder={t('register.password_repeat.placeholder')}
              aria-label={t('register.password_repeat.aria_label')}
              type="password"
              control={control}
            />

            <Box
            display="flex" justifyContent='space-between'
            >
              <Button
              type="submit"
              variant="contained"
              aria-label={t('register.submit_btn.aria_label')}
              disabled={!formState.isValid}
              >
                {t('register.submit_btn.submit')}
              </Button>

              <Button
              type='button'
              variant="contained"
              aria-label={t('register.login_btn.aria_label')}
              onClick={()=>navigate(ECE_ROUTE_PATHS.LOGIN)}
              >
                {t('register.login_btn.name')}
              </Button>
            </Box>

          </Box>

        </Paper>

      </Container>

    </Box>
  );
};

export default RegisterUI;


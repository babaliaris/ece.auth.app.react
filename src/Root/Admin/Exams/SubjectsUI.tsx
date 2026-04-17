import { useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box, Typography, Button, IconButton,
  List, ListItem, ListItemText,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, Zoom
} from '@mui/material';
import { Add, Edit, Delete, School } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TextInputCmp from '@/core/components/ui/TextInputCmp';
import { type ApiSubjectDataType } from '@/core/services/api/api.models';


export type SubjectData =
{
  m_name  : string;
  m_school: string;
};

export type SubjectsUIProps =
{
  subjects  : ApiSubjectDataType[];
  onSubmit  : (data: SubjectData, edit_uuid: string | null) => Promise<void>;
  onDelete  : (uuid: string) => Promise<void>;
  isLoading?: boolean;
};



function SubjectsUI(
{
  subjects, onSubmit, onDelete
}: SubjectsUIProps)
{
  const { t } = useTranslation();
  const [is_modal_opened, setIsModalOpened] = useState(false);
  const [editing_uuid, setEditingUUID]      = useState<string | null>(null);

  const schema = useMemo(() => yup.object(
  {
    m_name  : yup.string().required(t('required')).max(255, t('max_255')),
    m_school: yup.string().required(t('required')).max(255, t('max_255')),
  }).required(), [t]);

  const {
    control, handleSubmit, reset,
    formState
  } = useForm(
  {
    resolver      : yupResolver(schema),
    defaultValues : { m_name: '', m_school: '' },
    mode          : 'onChange'
  });



  const handleModalOpen = useCallback((subject?: ApiSubjectDataType) =>
  {
    if (subject)
    {
      setEditingUUID(subject.m_uuid);
      reset({m_name: subject.m_name, m_school: subject.m_school});
    }

    else
    {
      setEditingUUID(null);
      reset();
    }
    setIsModalOpened(true);
  }, [reset]);


  const handleModalClose = useCallback(()=>
  {
    reset({m_name: '', m_school: ''});
    setIsModalOpened(false);
  },[reset]);



  const internalOnSubmit = useCallback((data: SubjectData) =>
  {
    onSubmit(data, editing_uuid);
    handleModalClose();
  }, [onSubmit, editing_uuid, handleModalClose]);

  return (
    <Box
    sx=
    {{
      height: "100%",
      display: "flex", flexDirection: "column",
      overflow: "hidden"
    }}>

      <Typography
      variant="h4" fontWeight="700" gutterBottom
      sx=
      {{
        flexShrink: 0
      }}
      >
        {t('admin_subjects.title')}
      </Typography>

      <Typography
      variant="body1" color="text.secondary"
      sx=
      {{
        mb: 4
      }}>
        {t('admin_subjects.desc')}
      </Typography>

        <List
        disablePadding
        sx=
        {{
          flexGrow: 1,
          overflowY: "auto",
          pr: 1,
          /* Custom Scrollbar for better UX */
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { 
            background: (theme) => theme.palette.divider,
            borderRadius: '10px'
          }
        }}
        >
          {
            subjects.map((sub: ApiSubjectDataType) => (
            <Box
            key={sub.m_uuid}
            >

              <ListItem
                secondaryAction=
                {
                  <Box>

                    {/*Edit Subject Button*/}
                    <IconButton
                    onClick={() => handleModalOpen(sub)} color="primary"
                    >

                      <Edit fontSize="small" />

                    </IconButton>

                    {/*Delete Subject Button*/}
                    <IconButton
                    onClick={() => onDelete(sub.m_uuid)}
                    color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>

                  </Box>
                }
                sx=
                {{
                  border: 1,
                  borderColor: 'divider',
                  mb: 2,
                  mt: 2,
                  borderRadius: 2,
                  p: 3,

                  transition: (theme) => theme.transitions.create(['transform', 'border-color', 'box-shadow'],
                  {
                    duration: theme.transitions.duration.shorter,
                  }),

                  '&:hover':
                  {
                    borderColor: 'primary.main', 
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[4],
                    outline: '1px solid',
                    outlineColor: (theme) => theme.palette.primary.main,
                  }
                }}
              >

                <Box sx=
                {{
                  mr: 3, p: 1, borderRadius: 1,
                  bgcolor: 'primary.light', color: 'primary.main',
                  width: "fit-content", display: "flex", alignItems: "center"
                }}>
                  <School />
                </Box>

                <ListItemText
                  primary={sub.m_name}
                  secondary={sub.m_school}
                  slotProps=
                  {{
                    primary:
                    {
                      sx:
                      {
                        fontWeight: 600
                      },
                      variant: 'h6'
                    }
                  }}
                />

              </ListItem>

            </Box>
          ))}
        </List>

      {/* FLOATING ACTION BUTTON */}
      <Zoom
      in={true}
      style=
      {{
        transitionDelay: '300ms'
      }}>

        <Tooltip
        title={t('admin_subjects.float_btn.tip')}
        placement="left"
        >

          <Fab
            color="primary"
            aria-label={t('admin_subjects.float_btn.aria_label')}
            onClick={() => handleModalOpen()}
            sx=
            {{
              position: 'fixed', bottom: 32, right: 32
            }}
          >
            <Add />

          </Fab>

        </Tooltip>

      </Zoom>

      {/* CREATE/EDIT MODAL */}
      <Dialog
      open={is_modal_opened}
      onClose={handleModalClose}
      fullWidth maxWidth="sm"
      >

        <DialogTitle>
          {
            editing_uuid
              ? t('admin_subjects.dialog.title_edit')
              : t('admin_subjects.dialog.title_create')
          }
        </DialogTitle>

        <Box
        component="form"
        onSubmit={handleSubmit(internalOnSubmit)}
        >
          <DialogContent>
            <TextInputCmp
              name="m_name"
              label={t('admin_subjects.dialog.name.title')}
              placeholder={t('admin_subjects.dialog.name.placeholder')}
              control={control}
              fullWidth
            />

            <TextInputCmp
              name="m_school"
              label={t('admin_subjects.dialog.school.title')}
              placeholder={t('admin_subjects.dialog.school.placeholder')}
              control={control}
              fullWidth
            />

          </DialogContent>

          <DialogActions
          sx=
          {{
            p: 3
          }}>
            <Button
            onClick={handleModalClose}
            >
              {t('admin_subjects.dialog.cancel')}
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!formState.isValid}
            >
              {
                editing_uuid
                  ? t('admin_subjects.dialog.save')
                  : t('admin_subjects.dialog.create')
              }
            </Button>

          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default SubjectsUI;


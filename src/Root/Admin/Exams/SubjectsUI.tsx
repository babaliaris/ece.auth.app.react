import { useCallback } from 'react';
import { type Control } from 'react-hook-form';
import * as yup from 'yup';
import {
  Box, ListItemText
} from '@mui/material';
import { School } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TextInputCmp from '@/core/components/ui/TextInputCmp';
import { type ApiSubjectDataType } from '@/core/services/api/api.models';
import CrudPaginatedList, { type CrudPiginatedListController } from '@/components/CrudPaginatedList';
import i18n from '@/core/i18next.setup';


const SubjectShema = yup.object(
{
  m_name  : yup.string().required(i18n.t('required')).max(255, i18n.t('max_255')),
  m_school: yup.string().required(i18n.t('required')).max(255, i18n.t('max_255')),
}).required();


export type SubjectData = yup.InferType<typeof SubjectShema>;

type SubjectsUIProps =
{
} & CrudPiginatedListController<yup.InferType<typeof SubjectShema>, ApiSubjectDataType>;



function SubjectsUI(
{
  items, onSubmit, onDelete,
  has_more, is_loading_more, is_loading,
  onLoadMore, search_filter
}: SubjectsUIProps)
{
  const { t } = useTranslation();

  const itemUI = useCallback( (item: ApiSubjectDataType) =>
  <>
    <Box sx=
      {{
        mr: 2, p: 1, borderRadius: 1,
        bgcolor: 'primary.light', color: 'primary.main',
        width: "fit-content", display: "flex", alignItems: "center"
      }}>
        <School />
    </Box>

    <ListItemText
      primary={item.m_name}
      secondary={item.m_school}
      slotProps=
      {{
        primary:
        {
          sx:
          {
            fontWeight: 599
          },
          variant: 'h5'
        }
      }}
    />
  </>, []);

  const formUI = useCallback( (control: Control<SubjectData>) =>
  <>
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
  </>, [t]);




  return (
    <CrudPaginatedList<SubjectData, ApiSubjectDataType>
    title={t('admin_subjects.title')}
    schema={SubjectShema}
    default_values={{m_name: '', m_school: ''}}
    getUUID={(data)=>data.m_uuid}
    float_btn_tip={t('admin_subjects.float_btn.tip')}
    dialog_create_title={t('admin_subjects.dialog.title_create')}
    dialog_cancel={t('admin_subjects.dialog.cancel')}
    dialog_create={t('admin_subjects.dialog.create')}
    ItemUI={ item=>itemUI(item) }
    FormUI={ control=>formUI(control) }
    description={t('admin_subjects.desc')}
    editing=
    {{
      dialog_edit_title: t('admin_subjects.dialog.title_edit'),
      dialog_save: t('admin_subjects.dialog.save'),
      getEditValues: (data) => ({m_name: data.m_name, m_school: data.m_school})
    }}
    controller={{
      items,
      onSubmit,
      onDelete,
      onLoadMore,
      has_more,
      is_loading,
      is_loading_more,
      search_filter
    }}
    />
  );
}

export default SubjectsUI;


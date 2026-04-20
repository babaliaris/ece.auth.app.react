import { useCallback } from 'react';
import { type Control } from 'react-hook-form';
import * as yup from 'yup';
import {
  Box, ListItemText
} from '@mui/material';
import { HistoryEdu as HistoryEduIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TextInputCmp from '@/core/components/ui/TextInputCmp';
import SelectInputCmp from '@/core/components/ui/SelectInputCmp';
import { type ApiExamDataType } from '@/core/services/api/api.models';
import CrudPaginatedList, { type CrudPiginatedListController } from '@/components/CrudPaginatedList';
import i18n from "@/core/i18next.setup";


const ExamSchema = yup.object(
{
  m_semester: yup.string().oneOf(['FALL', 'SPRING']).required(i18n.t('required')),
  m_year    : yup.number().required(i18n.t('required')).typeError(i18n.t('not_a_number')),
}).required();


export type ExamData = yup.InferType<typeof ExamSchema>;

type ExamsUIProps =
{
} & CrudPiginatedListController<ExamData, ApiExamDataType>;



function ExamsUI(
{
  items, onSubmit, onDelete,
  has_more, is_loading_more, is_loading,
  onLoadMore
}: ExamsUIProps)
{
  const { t } = useTranslation();


  const itemUI = useCallback( (item: ApiExamDataType) =>
  <>
    <Box sx=
      {{
        mr: 2, p: 1, borderRadius: 1,
        bgcolor: 'primary.light', color: 'primary.main',
        width: "fit-content", display: "flex", alignItems: "center"
      }}>
        <HistoryEduIcon />
    </Box>

    <ListItemText
      primary={item.m_semester}
      secondary={item.m_year}
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

  const formUI = useCallback( (control: Control<ExamData>) =>
  <>
    <SelectInputCmp
      name="m_semester"
      label={t('admin_exams.dialog.semester.title')}
      control={control}
      fullWidth
      options={[
        { value: 'FALL', label: t('admin_exams.dialog.semester.fall') },
        { value: 'SPRING', label: t('admin_exams.dialog.semester.spring') },
      ]}
    />

    <TextInputCmp
      name="m_year"
      label={t('admin_exams.dialog.year.title')}
      placeholder={t('admin_exams.dialog.year.placeholder')}
      control={control}
      fullWidth
      type="number"
    />
  </>, [t]);


  return (
    <CrudPaginatedList<ExamData, ApiExamDataType>
    title={t('admin_exams.title')}
    schema={ExamSchema}
    default_values={{m_semester: 'FALL', m_year: 2025}}
    getUUID={(data)=>data.m_uuid}
    float_btn_tip={t('admin_exams.float_btn.tip')}
    dialog_create_title={t('admin_exams.dialog.title_create')}
    dialog_cancel={t('admin_exams.dialog.cancel')}
    dialog_create={t('admin_exams.dialog.create')}
    ItemUI={ item=>itemUI(item) }
    FormUI={ control=>formUI(control) }
    description={t('admin_exams.desc')}
    editing=
    {{
      dialog_edit_title: t('admin_exams.dialog.title_edit'),
      dialog_save: t('admin_exams.dialog.save'),
      getEditValues: (data) => ({m_semester: data.m_semester, m_year: data.m_year})
    }}
    controller={{
      items,
      onSubmit,
      onDelete,
      onLoadMore,
      has_more,
      is_loading,
      is_loading_more,
    }}
    />
  );
}

export default ExamsUI;


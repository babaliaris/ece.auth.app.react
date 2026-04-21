import { Box, TextField, MenuItem, Typography, Divider } from '@mui/material';
import { type ApiExamDataType } from '@/core/services/api/api.models';

interface ExaminationCreatorProps {
  selected_exam: ApiExamDataType | null;
  setSelectedExam: (val: ApiExamDataType | null) => void;
  start_hour: number;
  setStartHour: (val: number) => void;
  end_hour: number;
  setEndHour: (val: number) => void;
  time_step: number;
  setTimeStep: (val: number) => void;
}

function ExaminationCreator({
  selected_exam, setSelectedExam,
  start_hour, setStartHour,
  end_hour, setEndHour,
  time_step, setTimeStep
}: ExaminationCreatorProps)
{

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        1. Select Exam Period
      </Typography>
      {/* Placeholder for CrudPaginatedList. 
          For now, just a button/selector simulation 
      */}
      <Box sx={{ mb: 3, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
          {selected_exam 
            ? `Selected: ${selected_exam.m_semester} ${selected_exam.m_year}`
            : "Select an Exam Period using CrudPaginatedList..."}
          {/* You will implement handleModalOpen logic from CrudPaginatedList here */}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        2. Time Slot Configuration
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Start Hour"
          type="number"
          size="small"
          value={start_hour}
          onChange={(e) => setStartHour(Number(e.target.value))}
        />
        <TextField
          label="End Hour"
          type="number"
          size="small"
          value={end_hour}
          onChange={(e) => setEndHour(Number(e.target.value))}
        />
        <TextField
          select
          label="Step (Hours)"
          size="small"
          value={time_step}
          onChange={(e) => setTimeStep(Number(e.target.value))}
          sx={{ minWidth: 120 }}
        >
          {[1, 2, 3, 4].map((s) => (
            <MenuItem key={s} value={s}>{s} Hour{s > 1 ? 's' : ''}</MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};

export default ExaminationCreator;

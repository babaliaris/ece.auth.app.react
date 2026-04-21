import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Paper, Button, Typography } from '@mui/material';
import { startOfWeek, addDays } from 'date-fns';
import ExaminationCreator from './ExaminationCreator.tsx';
import ExamScheduleTable from './ExamScheduleTable.tsx';
import { type ApiExamDataType } from '@/core/services/api/api.models.ts';

const ExaminationsRoute = () => {
  // --- Grid Configuration State ---
  const [selected_exam, setSelectedExam] = useState<ApiExamDataType | null>(null);
  const [start_hour, setStartHour] = useState<number>(9);
  const [end_hour, setEndHour] = useState<number>(20);
  const [time_step, setTimeStep] = useState<number>(1);
  const [show_weekends, setShowWeekends] = useState<boolean>(true);
  
  // Track the Monday of the currently viewed week
  const [current_week_start, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // --- Form Logic ---
  // The form values will be an object: { "2026-04-06T09:00": "Subject Name", ... }
  const { control, handleSubmit } = useForm({
    mode: 'onChange'
  });

  const handleSaveSchedule = useCallback((data: any) => {
    console.log("Saving Schedule Data:", {
      exam_uuid: selected_exam?.m_uuid,
      schedule: data
    });
    // API call logic goes here later
  }, [selected_exam]);

  const changeWeek = useCallback((amount: number) => {
    setCurrentWeekStart((prev) => addDays(prev, amount * 7));
  }, []);

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="700" mb={3}>
          Examination Manager
        </Typography>
        
        <ExaminationCreator 
          selected_exam={selected_exam}
          setSelectedExam={setSelectedExam}
          start_hour={start_hour}
          setStartHour={setStartHour}
          end_hour={end_hour}
          setEndHour={setEndHour}
          time_step={time_step}
          setTimeStep={setTimeStep}
        />
      </Paper>

      {selected_exam && (
        <Box component="form" onSubmit={handleSubmit(handleSaveSchedule)}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
             <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={() => changeWeek(-1)}>Previous Week</Button>
                <Button onClick={() => changeWeek(1)}>Next Week</Button>
                <Button onClick={() => setShowWeekends(!show_weekends)}>
                  {show_weekends ? "Hide Weekends" : "Show Weekends"}
                </Button>
             </Box>
             <Button variant="contained" type="submit">Save Examination Schedule</Button>
          </Box>

          <ExamScheduleTable 
            control={control}
            current_week_start={current_week_start}
            start_hour={start_hour}
            end_hour={end_hour}
            time_step={time_step}
            show_weekends={show_weekends}
          />
        </Box>
      )}
    </Box>
  );
};

export default ExaminationsRoute;

import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format, addDays } from 'date-fns';
import { type Control } from 'react-hook-form';
import TextInputCmp from '@/core/components/ui/TextInputCmp';

interface ExamScheduleTableProps {
  control: Control<any>;
  current_week_start: Date;
  start_hour: number;
  end_hour: number;
  time_step: number;
  show_weekends: boolean;
}

const ExamScheduleTable = ({
  control,
  current_week_start,
  start_hour,
  end_hour,
  time_step,
  show_weekends
}: ExamScheduleTableProps) => {
  
  const days_to_show = show_weekends ? 7 : 5;
  
  // Generate time slots based on range and step
  const time_slots = useMemo(() => {
    const slots = [];
    for (let h = start_hour; h < end_hour; h += time_step) {
      slots.push(h);
    }
    return slots;
  }, [start_hour, end_hour, time_step]);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '70vh', border: '1px solid', borderColor: 'divider' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'action.hover' }}>Time</TableCell>
            {[...Array(days_to_show)].map((_, i) => {
              const day_date = addDays(current_week_start, i);
              return (
                <TableCell key={i} align="center" sx={{ fontWeight: 'bold', bgcolor: 'action.hover', minWidth: 150 }}>
                  {format(day_date, 'EEEE')}<br/>
                  {format(day_date, 'dd/MM/yyyy')}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {time_slots.map((hour) => (
            <TableRow key={hour}>
              <TableCell sx={{ fontWeight: '500' }}>
                {`${hour}:00 - ${hour + time_step}:00`}
              </TableCell>
              {[...Array(days_to_show)].map((_, i) => {
                const day_date = addDays(current_week_start, i);
                // Create a unique key for the form: "YYYY-MM-DD-HH:00"
                const field_name = `${format(day_date, 'yyyy-MM-dd')}-${hour}:00`;
                
                return (
                  <TableCell key={i}>
                    <TextInputCmp
                      name={field_name as any}
                      control={control}
                      placeholder="Subject Name..."
                      size="small"
                      margin="none" // Override standard margin for table density
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExamScheduleTable;

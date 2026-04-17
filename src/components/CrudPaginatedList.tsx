import { useState, useCallback } from 'react';
import { Add } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  type FieldValues,
  type DefaultValues,
  type Control,
  useForm
} from 'react-hook-form';

import {
  Box, Typography, Button, List,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';



interface CrudPaginatedListProps<T extends FieldValues>
{
  title: string;
  description?: string;
  items: any[];
  renderItem: (item: any, onEdit: (item: any) => void, onDelete: (uuid: string) => void) => React.ReactNode;
  // Modal Props
  createTitle: string;
  editTitle: string;
  saveLabel: string;
  cancelLabel: string;
  // Form/Schema
  schema: yup.ObjectSchema<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T, editUuid: string | null) => Promise<void>;
  onDelete: (uuid: string) => Promise<void>;
  // Pagination
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
  // The actual form fields
  children: (control: Control<T>) => React.ReactNode;
}


function CrudPaginatedList<T extends FieldValues>({
  title, description, items, renderItem,
  createTitle, editTitle, saveLabel, cancelLabel,
  schema, defaultValues, onSubmit, onDelete,
  hasMore, onLoadMore, isLoading, children
}: CrudPaginatedListProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState } = useForm<T>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange'
  });

  const handleClose = useCallback(() => {
    reset(defaultValues);
    setIsModalOpen(false);
  }, [reset, defaultValues]);

  const handleOpen = useCallback((item?: any) => {
    if (item) {
      setEditingUuid(item.m_uuid);
      reset(item); // Assumes item keys match form keys
    } else {
      setEditingUuid(null);
      reset(defaultValues);
    }
    setIsModalOpen(true);
  }, [reset, defaultValues]);

  const internalSubmit = (data: T) => {
    onSubmit(data, editingUuid);
    handleClose();
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Typography variant="h4" fontWeight="700" gutterBottom>{title}</Typography>
      {description && <Typography variant="body1" sx={{ mb: 4 }}>{description}</Typography>}

      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {items.map((item) => renderItem(item, handleOpen, onDelete))}
        
        {hasMore && (
          <Button onClick={onLoadMore} disabled={isLoading} fullWidth>
            Load More...
          </Button>
        )}
      </List>

      <Fab color="primary" onClick={() => handleOpen()} sx={{ position: 'fixed', bottom: 32, right: 32 }}>
        <Add />
      </Fab>

      <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingUuid ? editTitle : createTitle}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(internalSubmit)}>
          <DialogContent>
            {children(control)}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{cancelLabel}</Button>
            <Button type="submit" variant="contained" disabled={!formState.isValid}>
              {saveLabel}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default CrudPaginatedList;


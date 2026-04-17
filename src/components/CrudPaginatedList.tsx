import { useState, useCallback } from 'react';
import { useForm, type DefaultValues, type Resolver, type Control } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Box, Typography, Button, IconButton,
  List, ListItem,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, Zoom
} from '@mui/material';

import { Add, Edit, Delete } from '@mui/icons-material';


export type CrudPaginatedListProps<Tschema extends yup.AnyObject, Titem> =
{
  title                 : string,
  items                 : Titem[],
  schema                : yup.ObjectSchema<Tschema>,
  default_values        : Tschema,
  getUUID               : (data: Titem) => string,
  onSubmit              : (data: Tschema, edit_uuid: string | null) => Promise<void>,
  float_btn_tip         : string,
  dialog_create_title   : string,
  dialog_cancel         : string,
  dialog_create         : string,
  ItemUI                : (item: Titem)=>React.ReactNode,
  FormUI                : (control: Control<Tschema>)=>React.ReactNode,
  onDelete             ?: (uuid: string) => Promise<void>,
  description          ?: string,
  editing              ?:
  {
    dialog_edit_title : string,
    dialog_save       : string,
    getEditValues     : (data: Titem) => Tschema
  }
};



function CrudPaginatedList<Tschema extends yup.AnyObject, Titem>(
{
  items, onSubmit, onDelete, schema,
  default_values, getUUID, title, description,
  float_btn_tip, dialog_create_title,
  dialog_cancel, dialog_create, editing,
  ItemUI, FormUI
}: CrudPaginatedListProps<Tschema, Titem>)
{
  const [is_modal_opened, setIsModalOpened]         = useState(false);
  const [editing_uuid, setEditingUUID]              = useState<string | null>(null);
  const { control, handleSubmit, reset, formState } = useForm(
  {
    resolver      : yupResolver(schema) as Resolver<Tschema>,
    defaultValues : default_values as DefaultValues<Tschema>,
    mode          : 'onChange'
  });



  const handleModalOpen = useCallback((data?: Titem) =>
  {
    // Editing.
    if (data)
    {
      setEditingUUID( getUUID(data) );
      reset(editing ? editing.getEditValues(data) : default_values);
    }

    // Creating New Data.
    else
    {
      setEditingUUID(null);
      reset();
    }
    setIsModalOpened(true);
  }, [reset, getUUID, editing, default_values]);


  const handleModalClose = useCallback(()=>
  {
    reset(default_values);
    setIsModalOpened(false);
  },[reset, default_values]);



  const internalOnSubmit = useCallback((data: Tschema) =>
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

      { /*List Title*/ }
      <Typography
      variant="h4" fontWeight="700" gutterBottom
      sx=
      {{
        flexShrink: 0
      }}
      >
        {title}
      </Typography>

      { /*List Subtitle (Description)*/ }
      <Typography
      variant="body1" color="text.secondary"
      sx=
      {{
        mb: 4
      }}>
        {description}
      </Typography>

        { /*List Container*/ }
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

          { /*List Items */ }
          {
            items.map((item: Titem) => (
            <Box
            key={getUUID(item)}
            >

              <ListItem
                secondaryAction=
                {
                  <Box>

                    { /*Edit Subject Button*/ }
                    { editing &&
                      <IconButton
                      onClick={() => handleModalOpen(item)} color="primary"
                      >

                        <Edit fontSize="small" />

                      </IconButton>
                    }

                    { /*Delete Subject Button*/ }
                    {
                      onDelete &&
                      <IconButton
                      onClick={() => onDelete ? onDelete( getUUID(item) ) : null}
                      color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    }

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

                { /*User Content*/ }
                { ItemUI(item) }

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
        title={float_btn_tip}
        placement="left"
        >

          <Fab
            color="primary"
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
              ? editing?.dialog_edit_title
              : dialog_create_title
          }
        </DialogTitle>

        <Box
        component="form"
        onSubmit={handleSubmit(internalOnSubmit)}
        >

          { /* Dialog Content: It belongs outside this component */ }
          <DialogContent>
            {FormUI(control)}
          </DialogContent>
          { /*END OF DIALOG CONTENT*/ }

          <DialogActions
          sx=
          {{
            p: 3
          }}>
            <Button
            onClick={handleModalClose}
            >
              {dialog_cancel}
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!formState.isValid}
            >
              {
                editing_uuid
                  ? editing?.dialog_save
                  : dialog_create
              }
            </Button>

          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default CrudPaginatedList;


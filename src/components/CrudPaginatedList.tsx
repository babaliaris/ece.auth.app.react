import { useState, useCallback } from 'react';
import { useForm, type DefaultValues, type Resolver, type Control } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Box, Typography, Button, IconButton,
  List, ListItem, InputAdornment,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, Zoom, CircularProgress, Backdrop, TextField
} from '@mui/material';

import {
  Add, Edit, Delete, SignalCellularNoSim, Search as SearchIcon
} from '@mui/icons-material';

import { useTranslation } from 'react-i18next';



export type CrudPiginatedListController<Tschema extends yup.AnyObject, Titem> =
{
  items                 : Titem[],
  onSubmit              : (data: Tschema, edit_uuid: string | null) => Promise<void>,
  onDelete             ?: (uuid: string) => Promise<void>,
  onLoadMore           ?: () => Promise<void>,
  onItemClick          ?: (data: Titem) => void,
  has_more             ?: boolean,
  is_loading_more      ?: boolean,
  is_loading           ?: boolean,
  search_filter?:
  {
    onSearch    : (value: string) => void,
    is_searching: boolean,
    search_value: string
  }
};


type CrudPaginatedListProps<Tschema extends yup.AnyObject, Titem> =
{
  title                 : string,
  description          ?: string,
  schema                : yup.ObjectSchema<Tschema>,
  default_values        : Tschema,
  getUUID               : (data: Titem) => string,
  float_btn_tip         : string,
  dialog_create_title   : string,
  dialog_cancel         : string,
  dialog_create         : string,
  ItemUI                : (item: Titem)=>React.ReactNode,
  FormUI                : (control: Control<Tschema>)=>React.ReactNode,
  FilterUI             ?: React.ReactNode;
  editing              ?:
  {
    dialog_edit_title : string,
    dialog_save       : string,
    getEditValues     : (data: Titem) => Tschema
  },
  controller          : CrudPiginatedListController<Tschema, Titem>
};



function CrudPaginatedList<Tschema extends yup.AnyObject, Titem>(
{
  title, description, schema, default_values, getUUID,
  float_btn_tip, dialog_create_title,
  dialog_cancel, dialog_create, ItemUI, FormUI, FilterUI,
  editing, controller
}: CrudPaginatedListProps<Tschema, Titem>)
{
  const {
    items, onSubmit, onDelete, onLoadMore,
    has_more, is_loading_more, is_loading,
    search_filter
  } = controller;

  const [is_modal_opened, setIsModalOpened]         = useState(false);
  const [editing_uuid, setEditingUUID]              = useState<string | null>(null);
  const {t}                                         = useTranslation();
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
      overflow: "hidden",
      position: "relative"
    }}>

      {/* THE LOADING OVERLAY */ }
      <Backdrop
      sx=
      {{
        color: 'primary.main',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        position: 'absolute',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
      open={!!is_loading}
      >
        <CircularProgress
        color="primary"
        />

        <Typography variant="h6">
          {t('crud_paginated_list.on_mount_loading')}
        </Typography>
      </Backdrop>

      {/* HEADER AREA*/}
      <Box
      sx=
      {{
        display: "flex", flexDirection: "row",
      }}
      >
        {/*TITLE & DESCRIPTION*/}
        <Box
        sx=
        {{
          display: 'flex', flexDirection: "column",
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
        </Box>


        {/* FILTERING AREA */}
        <Box
        sx=
        {{
          display: 'flex', alignItems: 'center', gap: 2,
          ml: "auto"
        }}>
          {/* Internal Search Bar */}
          {
            search_filter &&
            <TextField
              size="small"
              placeholder={t('crud_paginated_list.search_placeholder')}
              onChange={(e) => search_filter.onSearch(e.target.value)}
              value={search_filter.search_value ?? ""}
              sx=
              {{
                minWidth: 250
              }}
              slotProps=
              {{
                input:
                {
                  startAdornment:(
                    <InputAdornment position="start">
                      {
                        search_filter.is_searching ?
                        <CircularProgress size={20} thickness={5}/> :
                        <SearchIcon fontSize="small" />
                      }
                    </InputAdornment>
                  )
                }
              }}
            />
          }

          {/* User-defined Custom Filter UI */}
          {FilterUI}
        </Box>

      </Box>

      {/* ACTIVE FILTER WARNING / CHIP */}
      {search_filter?.search_value && (
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: (theme) => theme.palette.warning.main + 15,
            border: '1px dashed',
            borderColor: 'warning.main'
          }}
        >
          {/*Filter warning message*/}
          <Typography
          variant="body2"
          sx=
          {{
            flexGrow: 1,
            color: 'warning.dark',
            fontWeight: 500
          }}>
            {t('crud_paginated_list.filtering_by')}: <strong>"{search_filter.search_value}"</strong>
          </Typography>

          {/*Clear FILTERS Button*/}
          <Button
            size="small"
            color="warning"
            variant="contained"
            disableElevation
            onClick={() => search_filter.onSearch("")} // This triggers the clear logic
            sx=
            {{
              borderRadius: '20px', textTransform: 'none', px: 2
            }}
          >
            {t('crud_paginated_list.clear_filters')}
          </Button>
        </Box>
      )}

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
            disablePadding
            secondaryAction=
            {
              <Box>

                { /*Edit Subject Button*/ }
                { editing &&
                  <IconButton
                  onClick={(e) =>
                  {
                    e.stopPropagation();
                    handleModalOpen(item);
                  }}
                  color="primary"
                  >

                    <Edit fontSize="small" />

                  </IconButton>
                }

                { /*Delete Subject Button*/ }
                {
                  onDelete &&
                  <IconButton
                  onClick={(e) =>
                  {
                    e.stopPropagation();
                    onDelete ? onDelete( getUUID(item) ) : null;
                  }}
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
              <Box
                onClick={() => controller.onItemClick?.(item)}
                sx={{
                  width: '100%',
                  p: 3, // Apply the padding here instead of the ListItem
                  cursor: controller.onItemClick ? 'pointer' : 'default',
                  // Manual ripple/hover state simulation if not using ListItemButton
                  '&:active': { bgcolor: 'action.selected' }
                }}
              >
                { ItemUI(item) }
              </Box>

            </ListItem>

          </Box>

        ))}

        {/* EMPTY STATE VIEW */}
        {!is_loading && items.length === 0 && (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8,
              textAlign: 'center',
              p: 3,
            }}
          >
            {/*Icon Container*/}
            <Box
              sx={{
                fontSize: 64,
                color: 'divider',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/*Display an Icon*/}
              <SignalCellularNoSim
              color='primary'
              sx=
              {{
                fontSize: 'inherit'
              }}/>
            </Box>

            {/*Empty List Title*/}
            <Typography
            variant="h5" fontWeight="600" color="text.secondary" gutterBottom
            >
              {t('crud_paginated_list.empty_title')}
            </Typography>

            {/*Empty List Description*/}
            <Typography
            variant="body1" color="text.secondary"
            >
              {t('crud_paginated_list.empty_description')}
            </Typography>

          </Box>
        )}
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

      {has_more && (
        <Box
        sx=
        {{
          display: 'flex', justifyContent: 'center', p: 2
        }}>
          <Tooltip
          title={t('crud_paginated_list.load_more_btn.tip')}
          >
            <span>
              <Button
                variant="contained"
                onClick={onLoadMore}
                disabled={is_loading_more}
                startIcon={is_loading_more ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{textTransform: "none"}}
              >
                {is_loading_more ? t('crud_paginated_list.load_more_btn.loading') : t('crud_paginated_list.load_more_btn.more')}
              </Button>
            </span>
          </Tooltip>
        </Box>
      )}

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


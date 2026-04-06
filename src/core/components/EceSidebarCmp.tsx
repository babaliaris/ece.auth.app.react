import { type ReactNode, useState } from "react";

export interface EceSidebarItemI
{
  icon    : ReactNode;
  tip     : string;
  title?  : string;
  onClick : () => void;
  active? : boolean;
};

export interface EceSidebarProps
{
  item_data: EceSidebarItemI[];
  width?   : number;
};

import {
  Box, IconButton,
  List, ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from "@mui/icons-material";

function EceSidebarCmp (
{
  item_data, width
}: EceSidebarProps)
{
  const [is_expanded, setIsExpanded] = useState(false);
  const bar_width = width ? width : 280;

  return (
    <Box
      sx=
      {{
        width: is_expanded ? bar_width: 80,
        minWidth: 80,
        height: "100%",
        borderRight: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflowX: "hidden"
      }}
    >

      <Box
      sx=
      {{
        p: 1, display: "flex",
        justifyContent: is_expanded ? "flex-end" : "center",
      }}>

        <IconButton
        onClick={()=>setIsExpanded(!is_expanded)}
        >
          { !is_expanded &&
            <KeyboardArrowRightIcon />
          }
          {
            is_expanded &&
            <KeyboardArrowLeftIcon/>
          }
        </IconButton>

      </Box>

      <List
      sx=
      {{
        pt: 2
      }}>
        {item_data.map((item, index) => (
          <ListItem
          key={index}
          disablePadding
          sx=
          {{
            display: "block", mb: 0.5
          }}>
            <Tooltip
            title={item.tip} placement="right" arrow
            >
              <ListItemButton
                onClick={item.onClick}
                selected={item.active}
                sx={{
                    minHeight: 48,
                    borderRadius: 1,
                    px: 2.5,
                    justifyContent: "flex-start",
                    transition: "padding 0.3s",
                    "&:hover": {
                      backgroundColor: "primary.light",
                      color: "primary.main",
                      "& .MuiListItemIcon-root": {
                        color: "primary.dark",
                      },
                    },
                    "&.Mui-selected": {
                      backgroundColor: "action.selected",
                      color: "primary.main",
                      "& .MuiListItemIcon-root": {
                        color: "primary.main",
                      },
                      "&:hover": {
                        backgroundColor: "action.focus",
                      },
                    },
                  }}>
                <ListItemIcon
                  sx=
                  {{
                    minWidth: 0,
                    mr: is_expanded ? 2 : "auto",
                    width: 24,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {is_expanded && item.title && (
                  <ListItemText
                    primary={item.title}
                    slots=
                    {{
                      primary: 'span'
                    }}
                    slotProps=
                    {{
                      primary:
                      {
                        sx:
                        {
                          fontWeight: "bold",
                          color: "primary.main",
                          transition: "color 0.3s"
                        }
                      }
                    }}
                  />
                )}

              </ListItemButton>

            </Tooltip>

          </ListItem>
        ))}

      </List>

    </Box>
  );
};

export default EceSidebarCmp;


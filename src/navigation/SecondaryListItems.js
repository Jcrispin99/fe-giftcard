import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import IconUI from "./NavaIcon";

const SecondaryListItems = () => {
  return (
    <div>
      <ListSubheader inset>Saved reports</ListSubheader>
      <ListItem button>
        <ListItemIcon>
          <IconUI icon='assignment' style={{ fontSize: 'xx-large' }} />
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <IconUI icon='assignment' style={{ fontSize: 'xx-large' }} />
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <IconUI icon='assignment' style={{ fontSize: 'xx-large' }} />
        </ListItemIcon>
        <ListItemText primary="Year-end sale" />
      </ListItem>
    </div>
  );
};

export { SecondaryListItems };

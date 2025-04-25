import { ListItemProps as MuiListItemProps, GridProps as MuiGridProps } from '@mui/material';

declare module '@mui/material' {
  // Extend ListItemProps to make the 'component' prop optional
  interface ListItemProps extends MuiListItemProps {
    component?: React.ElementType;  // Make 'component' prop optional
  }

  // Extend GridProps to make the 'item' prop optional
  interface GridProps extends MuiGridProps {
    item?: boolean;  // Make 'item' prop optional
  }
}

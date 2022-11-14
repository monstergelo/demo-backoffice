import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { createContext, useContext } from "react";
import { DialogContextProps, GenericProviderProps, DialogProps } from "./type";
 
const defaultValue: DialogContextProps = {
  createDialog: ({title,content,action}) => (<></>),
  handleClose: () => {},
  handleOpen: () => {},
  setLoading: () => {},
  loading: false,
}

export const DialogContext = createContext(defaultValue)
export const DialogProvider = ({ children }: GenericProviderProps) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState(<></>);
  const [action, setAction] = React.useState(<></>);
  const [title, setTitle] = React.useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false)
    setTitle('');
    setContent(<></>);
    setAction(<></>);
  };

  const createDialog = ({title,content,action}: DialogProps) => {
    setTitle(title);
    setContent(content);
    setAction(action);
    handleOpen();
  }

  const dialogValue = {
    createDialog,
    handleOpen,
    handleClose,
    setLoading,
    loading,
  }

  return (
    <>
      <DialogContext.Provider value={dialogValue}>
        {children}
      </DialogContext.Provider>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={false}
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          {action}
        </DialogActions>
      </Dialog>
    </>
  )
};

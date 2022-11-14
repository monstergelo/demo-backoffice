import { Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState, useEffect, useMemo } from "react";
import { GenericProviderProps, userType } from "./type";

export type alertType = 	'error'
| 'info'
| 'success'
| 'warning'

export interface SnackbarMessage {
  message: string;
  key: number;
  type: alertType;
}

export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

export const AlertContext = React.createContext<any>({
  alert: (message: string, type: alertType) => {}
});

export const AlertProvider = ({children}: GenericProviderProps) => {
  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(
    undefined,
  );

  const handleOpen = useMemo(() => (message: string, type: alertType) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime(), type }]);
  }, []);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const contextValue = {
    alert: handleOpen
  }

  return (
    <>
      <AlertContext.Provider value={contextValue}>
        {children}
      </AlertContext.Provider>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        
      </Snackbar> */}
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert onClose={handleClose} severity={messageInfo?.type ?? 'success'} sx={{ width: '100%' }}>
          {messageInfo?.message ?? ''}
        </Alert>
      </Snackbar>
    </>
  )
}
import React, { useContext } from "react";
import { 
  Box, Button, Typography
} from "@mui/material";
import { Datatable } from "reusables/Datatable";
import { CellContext } from "@tanstack/react-table";
import { DialogContext } from "module/BasePage/DialogProvider";
import { isJsonString } from "reusables/utilities";

const columns = [
  {
    name: 'log',
    label: 'Log',
    cell: (info: CellContext<any, any>) => {
      const row = info.row.original;
      const { log: logString } = row;
      const log = isJsonString(logString) ? JSON.parse(logString) : {};
  
      return (
        <>
          <Typography>{`Method: ${log?.method}`}</Typography>
          <Typography>{`URL: ${log?.url}`}</Typography>
        </>
      )
    },
  },
  {
    name: 'created_at',
    label: 'Created At',
  },
]

const AdminLogList = () => {
  const { createDialog } = useContext(DialogContext);

  const handleDetails = (log: any) => () => createDialog({
    title: 'Log',
    content: (
      <Typography>
        <pre>
          {JSON.stringify(log, null, 2)}
        </pre>
      </Typography>
    ),
    action: <></>
  })
  

  const actionProps = {
    rowIdentifier: 'name'
  }

  const enhancedColumns = [
    ...columns,
    {
      name: 'details',
      label: 'Details',
      enableColumnFilter: false,
      enableSorting: false,
      cell: (info: CellContext<any, any>) => {
        const row = info.row.original
        const { log: logString } = row;
        const log = isJsonString(logString) ? JSON.parse(logString) : {};
    
        return (
          <>
            <Button 
              color="primary"
              onClick={handleDetails(log)}
              variant="contained"
            >
              Details
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <Box>
      <Datatable
        columns={enhancedColumns}
        actionProps={actionProps}
        url={'/admin-log/tabledata'}
        title="AdminLog"
      />
    </Box>
    
  );
};

export default AdminLogList;

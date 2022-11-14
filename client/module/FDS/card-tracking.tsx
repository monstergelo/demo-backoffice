import React, { useContext } from "react";
import { 
  Box, Button, Typography
} from "@mui/material";
import { Datatable } from "reusables/Datatable";
import { FetchContext } from "module/BasePage/FetchProvider";
import { Block } from "@mui/icons-material";
import { CellContext } from "@tanstack/react-table";
import { DialogContext } from "module/BasePage/DialogProvider";

const columns = [
  {
    name: 'card_number',
    label: 'Card Number'
  },
  {
    name: 'blacklist',
    label: 'Blacklist',
    cell: (info: CellContext<any, any>) => {
      const row = info.row.original
      const { blacklist } = row
  
      return (
        <Box>
          {blacklist 
            ? <Block color="error" /> 
            : '-'}
        </Box>
      )
    },
  },
  {
    name: 'number_of_transaction',
    label: 'Number of Transaction'
  },
  {
    name: 'last_transaction_time',
    label: 'Last Transaction'
  },
]

const FDSCardTracking = () => {
  const [manualRefresh, setManualRefresh] = React.useState(0)
  const { put } = useContext(FetchContext);
  const { createDialog, handleClose } = useContext(DialogContext);

  const refresh = () => {
    setManualRefresh((prev) => prev+1)
  }

  const onBan = (row: {id: string, blacklist: boolean}) => {
    const submitData: any = {
      blacklist: !row?.blacklist
    }
    put('/fds-card/'+row?.id, { body: submitData }).then(() => {refresh()})
  }

  const handleBan = (row: any) => () => createDialog({
    title: 'Blacklist',
    content: 
      <Typography>
        {`Are you sure want to ${row?.blacklist ? 'unban' : 'ban'} ${row['card_number']}?`}
      </Typography>,
    action: (
      <Box>
        <Button
          variant="contained"
          onClick={() => {
            onBan(row)
            handleClose()
          }}
        >
          confirm
        </Button>
      </Box>
    )
  })
  

  const actionProps = {
    rowIdentifier: 'name'
  }

  const enhancedColumns = [
    ...columns,
    {
      name: 'action',
      label: 'Action',
      enableColumnFilter: false,
      enableSorting: false,
      cell: (info: CellContext<any, any>) => {
        const row = info.row.original
        const { blacklist } = row
    
        return (
          <>
            <Button 
              color={blacklist ? 'primary' : 'warning'}
              onClick={handleBan(row)}
              variant="contained"
            >
              {blacklist ? 'Unban' : 'Ban'}
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
        manualRefresh={manualRefresh}
        url={'/fds-card/tabledata'}
        title="FDS Card Tracking"
      />
    </Box>
    
  );
};

export default FDSCardTracking;

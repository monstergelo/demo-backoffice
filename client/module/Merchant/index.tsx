import React, { useContext } from "react";
import { 
  Box, Button, Typography
} from "@mui/material";
import { Datatable } from "reusables/Datatable";
import { FetchContext } from "module/BasePage/FetchProvider";
import { CellContext, Table } from "@tanstack/react-table";
import { DialogContext } from "module/BasePage/DialogProvider";
import { Check, Close } from "@mui/icons-material";

export type Merchant = {
  name: string
}

const columns = [
  {
    name: 'name',
    label: 'Name'
  },
  {
    name: 'type',
    label: 'Type',
    enableColumnFilter: false,
    enableSorting: false
  },
  {
    name: 'verified',
    label: 'Verified',
    cell: (info: CellContext<any, any>) => {
      const row = info.row.original
      const { verified } = row
  
      return (
        <Box display="flex" justifyContent="center">
          {verified ? <Check color="success" /> : <Close color="warning" />}
        </Box>
      )
    },
  },
  {
    name: 'logo',
    label: 'Logo'
  },
  {
    name: 'email',
    label: 'Email'
  },
  {
    name: 'client_key',
    label: 'Client Key'
  },
  {
    name: 'secret_key',
    label: 'Secret Key'
  },
]

export interface MerchantListProps {
  paths: {
    edit: string;
    add: string;
  }
  type: 'PRODUCTION' | 'SANDBOX'
}

const MerchantList = ({ type, paths }: MerchantListProps) => {
  const [manualRefresh, setManualRefresh] = React.useState(0)
  const { remove, put } = useContext(FetchContext);

  const { createDialog, handleClose } = useContext(DialogContext);
  const handleApprove = (row: any) => () => createDialog({
    title: 'Approve',
    content: <Typography>{`Are you sure want to Approve ${row['name']}?`}</Typography>,
    action: (
      <Box>
        <Button
          variant="contained"
          onClick={() => {
            onApprove(row?.id)
            handleClose()
          }}
        >
          confirm
        </Button>
      </Box>
    )
  })
  const refresh = () => {
    setManualRefresh((prev) => prev+1)
  }

  const onDelete = async (id: string)  => {
    await remove('/merchant/'+id);
  }

  const onApprove = (id: string) => {
    const submitData: any = {
      verified: 'true'
    }
    put('/merchant/'+id, { body: submitData }).then(() => {refresh()})
  }

  const actionProps = {
    onDelete,
    paths,
    rowIdentifier: 'name'
  }

  const initialState = {
    columnFilters: [
      {
        id: "type",
        value: type
      }
    ]
  }

  const enhancedColumns = [
    ...columns,
    {
      name: 'approve',
      label: 'Approve',
      enableColumnFilter: false,
      enableSorting: false,
      cell: (info: CellContext<any, any>) => {
        const row = info.row.original
        const { verified } = row
    
        return (
          <>
            <Button onClick={handleApprove(row)} variant="contained" disabled={verified}>
              Approve
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <Box>
      <Datatable
        columns={type == "PRODUCTION" ? enhancedColumns : columns}
        actionProps={actionProps}
        url={'/merchant/tabledata'}
        title="Merchant List"
        initialState={initialState}
        manualRefresh={manualRefresh}
      />
    </Box>
    
  );
};

export default MerchantList;

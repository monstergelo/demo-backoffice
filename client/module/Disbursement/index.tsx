import React, { useContext } from "react";
import { 
  Box
} from "@mui/material";
import { Datatable } from "reusables/Datatable";
import { FetchContext } from "module/BasePage/FetchProvider";
import { useRouter } from "next/router";

export type Disbursement = {
  name: string
  email: string
  password: number
}

const columns = [
  {
    name: 'status',
    label: 'Status'
  },
  {
    name: 'amount',
    label: 'Amount',
    cell: (info: any) => {
      const row = info.row.original

      return <>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.amount)}</>
    }
},
  {
    name: 'notes',
    label: 'Notes',
  },
  {
    name: 'merchant_name',
    label: 'Merchant',
  },
  {
    name: 'account_number',
    label: 'Bank Account',
  },
]

export interface DisbursementListProps {
  paths: {
    edit: string;
    add: string;
  }
}

const DisbursementList = ({ paths }: DisbursementListProps) => {
  const { remove } = useContext(FetchContext);

  // const onDelete = async (id: string)  => {
  //   await remove('/disbursement/'+id);
  // }

  const actionProps = {
    paths,
    rowIdentifier: 'notes'
  }

  return (
    <Box>
      <Datatable
        columns={columns}
        actionProps={actionProps}
        url={'/disbursement/tabledata'}
        title="Disbursement List"
      />
    </Box>
    
  );
};

export default DisbursementList;

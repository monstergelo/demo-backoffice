import React, { useContext } from "react";
import { 
  Box
} from "@mui/material";
import { Datatable } from "reusables/Datatable";
import { FetchContext } from "module/BasePage/FetchProvider";
import { useRouter } from "next/router";

export type Admin = {
  name: string
  email: string
  password: number
}

const columns = [
  {
    name: 'name',
    label: 'Name'
  },
  {
    name: 'email',
    label: 'Email'
},
  {
    name: 'password',
    label: 'Password',
    enableSorting: false,
    enableColumnFilter: false,
  },
]

export interface AdminListProps {
  paths: {
    edit: string;
    add: string;
  }
}

const AdminList = ({ paths }: AdminListProps) => {
  const { remove } = useContext(FetchContext);
  const router = useRouter()

  const onDelete = async (id: string)  => {
    await remove('/admin/'+id);
  }

  const actionProps = {
    onDelete,
    paths,
    rowIdentifier: 'name'
  }

  return (
    <Box>
      <Datatable
        columns={columns}
        actionProps={actionProps}
        url={'/admin/tabledata'}
        title="Admin List"
      />
    </Box>
    
  );
};

export default AdminList;

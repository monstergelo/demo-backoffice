import React, { useContext } from "react";
import { 
  Box
} from "@mui/material";
import { Datatable } from "reusables/Datatable";
import { FetchContext } from "module/BasePage/FetchProvider";
import { useRouter } from "next/router";

export type Role = {
  name: string
}

const columns = [
  {
    name: 'name',
    label: 'Name'
  },
  {
    name: 'permissions',
    label: 'Permissions'
  },
]

export interface RoleListProps {
  paths: {
    edit: string;
    add: string;
  }
}

const RoleList = ({ paths }: RoleListProps) => {
  const { remove } = useContext(FetchContext);
  const router = useRouter()

  const onDelete = async (id: string)  => {
    await remove('/role/'+id);
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
        url={'/role/tabledata'}
        title="Role List"
      />
    </Box>
    
  );
};

export default RoleList;

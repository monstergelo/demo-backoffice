import React, { useContext } from "react";
import { 
  Box,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { 
  useReactTable,
  getCoreRowModel,
  SortingState,
  ColumnFiltersState,
  createColumnHelper,
} from "@tanstack/react-table";
import { Delete, Edit } from "@mui/icons-material";
import { DialogContext } from "module/BasePage/DialogProvider";
import { FetchContext } from "module/BasePage/FetchProvider";
import { DatatableProps } from "./type";
import NextLink from "reusables/NextLink";

const getFilterArray = (columnFilters: any = [], columns: any) => {
  const filterArray: string[] = [];
  columns.forEach((column: any) => {
    const columnName = column?.accessorKey || column?.name
    const filterValue = columnFilters.find((val: any) => val.id === columnName)?.value ?? ''

    filterArray.push(filterValue)
  });

  return filterArray
}

export const useDatatable = ({ actionProps, columns, url, initialState, manualRefresh }: DatatableProps) => {
  const paths = actionProps?.paths;
  const [refresh, setRefresh] = React.useState(0);
  const refreshTable = () => setRefresh((prev) => prev + 1)

  // Columns=====================================================================
  const { createDialog, handleClose: handleDeleteClose } = useContext(DialogContext);
  const memoizedColumns = React.useMemo(() => {
    const columnHelper = createColumnHelper<any>();

    const handleDelete = actionProps ? (row: any) => () => {
      createDialog({
        title: 'Delete',
        content: <Typography>{`Are you sure want to delete ${row[actionProps?.rowIdentifier]}?`}</Typography>,
        action: (
          <Box>
            <Button
              disabled={false}
              variant="contained"
              onClick={() => {
                actionProps?.onDelete && actionProps?.onDelete(row?.id)
                handleDeleteClose()
                refreshTable()
              }}
            >
              confirm
            </Button>
          </Box>
        )
      })
    } : () => () => {}

    return [
      ...columns?.map((col) => (
        columnHelper.accessor(col?.name, {
            header: () => (
              <Typography
                variant="h6"
                id="tableTitle"
              >
                {col?.label}
              </Typography>
            ),
            ...col,
          }
        )
      )),
      ...(paths?.['edit'] || actionProps?.onDelete ? [columnHelper.accessor('actions', {
        header: () => (
          <Typography
            variant="h6"
            id="tableTitle"
          >
            Actions
          </Typography>
        ),
        cell: (info) => {
          const row = info.row.original
  
          return(
            <Box>
              {paths?.['edit'] && (
                <NextLink href={{
                  pathname: paths?.['edit'],
                  query: {
                    id: row?.id
                  }
                }}>
                  <IconButton>
                    <Edit />
                  </IconButton>
                </NextLink>
              )}
              
              {actionProps?.onDelete && (
                <IconButton onClick={handleDelete(row)}>
                  <Delete />
                </IconButton>
              )}
              
            </Box>
          )
        },
        enableSorting: false,
        enableColumnFilter: false,
      })]: []),
    ]
  }, [actionProps, createDialog, handleDeleteClose, columns, paths])

  // Data========================================================================
  const fetch = useContext(FetchContext)
  const get = React.useMemo(() => fetch.get, [fetch.get])
  const [data, setData] = React.useState({rows: [], count: 0});

  // Pagination==================================================================
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  // Sort========================================================================
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setcolumnFilters] = React.useState<ColumnFiltersState >([]);
  const [anchorFilter, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [openFilter, setOpenId] = React.useState('')

  const handleFilterClick = (newOpenId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenId(newOpenId)
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
    setOpenId('');
  };

  // Table-Management============================================================
  const table = useReactTable({
    data: data?.rows,
    columns: memoizedColumns,
    pageCount: data?.count,
    initialState,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setcolumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  React.useEffect(() => {
    setcolumnFilters(initialState?.columnFilters);
  }, [initialState])

  React.useEffect(() => {
    const fetchData = async() => {
      const newData = await get(url, {
        params: {
          page: pageIndex,
          pageLimit: pageSize,
          sort: sorting?.[0]?.id ?? '',
          sortDirection: sorting.length === 0 ? '' : sorting?.[0]?.desc ? 'desc' : 'asc',
          filters: getFilterArray(columnFilters, columns)
        }
      });
      setData(newData)
    }

    fetchData()
  }, [
    get,
    url,
    pageIndex,
    pageSize,
    sorting,
    columnFilters,
    columns,
    refresh,
    manualRefresh,
    initialState
  ]);

  return {
    table,
    paths: actionProps?.paths,
    anchorFilter,
    handleFilterClick,
    handleFilterClose,
    openFilter,
    refreshTable
  }
}
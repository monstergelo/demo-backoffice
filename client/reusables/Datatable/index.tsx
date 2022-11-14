import React from "react";
import { 
  Box,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Table,
  TableContainer,
  Paper,
  TablePagination,
  TextField,
  Popover,
  IconButton,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { 
  flexRender,
} from "@tanstack/react-table";
import { BiSort, BiSortUp, BiSortDown } from 'react-icons/bi';
import { blue } from "@mui/material/colors";
import { Add, FilterList } from "@mui/icons-material";
import { useDatatable } from "./useDataTable";
import { DatatableProps } from "./type";
import NextLink from "reusables/NextLink";

export const Datatable = ({
  title = "title",
  ...props
}: DatatableProps) => {
  const {
    table,
    paths,
    handleFilterClick,
    handleFilterClose,
    openFilter,
    anchorFilter
  } = useDatatable(props)

  // Render===========================================================================
  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          bgcolor: blue[200]
        }}
      >
        <Box sx={{ flex: '1 1 100%' }}>
          <Typography
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {title}
          </Typography>
        </Box>
        <Box>
          { paths?.['add'] && (
            <NextLink href={{
              pathname: paths?.['add'],
              query: {}
            }}>
              <Button fullWidth variant="contained" endIcon={<Add />}>
                Add
              </Button>
            </NextLink>
          )}
          
        </Box>
      </Toolbar>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* Header ########################################*/}
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell 
                    sx={{cursor: header.column.getCanSort() ? 'pointer' : 'inherit'}}
                    key={header.id}
                    colSpan={header.colSpan}
                    
                  >
                    <Box display="flex" justifyContent="space-between">
                      <Box display="flex" alignItems="center" onClick={header.column.getToggleSortingHandler()}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                        )}
                        {{
                          asc: <BiSortUp />,
                          desc: <BiSortDown />,
                        }[header.column.getIsSorted() as string] ?? (
                          header.column.getCanSort() && !header.isPlaceholder ? <BiSort /> : null
                        )}
                      </Box>
                      {header.column.getCanFilter() && !header.isPlaceholder ? 
                        <Box>
                          <IconButton onClick={handleFilterClick(header.column.id)}>
                            <FilterList />
                          </IconButton>
                          <Popover
                            id={header.column.id}
                            open={openFilter === header.column.id}
                            onClose={handleFilterClose}
                            anchorEl={anchorFilter}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                          >
                            <Box p="8px">
                              <TextField 
                                label={`filter-${header.column.id}`}
                                value={header.column.getFilterValue()}
                                onChange={(e) => {
                                  header.column.setFilterValue(e.target.value)
                                }}
                              />
                            </Box>
                          </Popover>
                        </Box> : null
                      }
                      
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          {/* Body ###########################################*/}
          <TableBody>
            {table.getRowModel() && table.getRowModel().rows.map(row => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {row.getVisibleCells().map(cell => (
                  <TableCell align="left" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination ###########################################*/}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={Number(table.getPageCount())}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={(event) => {
          table.setPageSize(parseInt(event.target.value, 10));
          table.setPageIndex(0);
        }}
      />
    </Paper>
    
  )
}
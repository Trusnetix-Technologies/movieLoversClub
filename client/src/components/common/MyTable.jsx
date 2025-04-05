import moment from "moment";
import { CSVLink } from "react-csv";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef, use } from "react";

// ==== IMPORT COMPONENTS ====
import {
  Box,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Tooltip,
  Typography,
  TablePagination,
  InputAdornment,
  useTheme,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import {
  MyTable,
  MyTableBadge,
  MyTableBody,
  MyTableCell,
  MyTableCheckbox,
  MyTableContainer,
  MyTableFilterMenu,
  MyTableHead,
  MyTableIconButton,
  MyTablePagination,
  MyTableRow,
  MyTableSortLabel,
  MyTableTextField,
  MyTableToolButton,
  MyTableTools,
  SearchBox,
  MyPrimarySelect,
  PrimaryButton,
} from "@/styles/mui/tableComponents";
import Iconify from "./Iconify";
import { rgba } from "emotion-rgba";

function TableLoading() {
  const theme = useTheme();
  return (
    <Box
      id="table-loading"
      sx={{
        position: "absolute",
        zIndex: 99,
        height: "100%",
        width: "100%",
        backgroundColor: rgba(theme.palette.background.default, 0.5),
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <CircularProgress /> */}
      <Iconify
        icon="svg-spinners:gooey-balls-2"
        sx={{
          width: "50px",
          height: "50px",
          color: theme.palette.primary.main,
        }}
      />
    </Box>
  );
}

function TableHeader({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  selectable,
  onRequestSort,
  columns,
  rowSelection,
  actions,
  onRequestSearch,
  options,
}) {
  const theme = useTheme();

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <MyTableHead
      id="table-header"
      sx={{
        ...options?.tableHeaderStyle,
      }}
    >
      <MyTableRow
        sx={{
          ...options?.tableHeaderStyle?.rowStyle,
        }}
      >
        {(rowSelection || rowSelection == null) && selectable && (
          <MyTableCell
            id="table-header-cell-1"
            padding="none"
            sx={{
              ...options?.tableHeaderStyle?.cellStyle,
            }}
          >
            <MyTableCheckbox
              icon={
                <Iconify
                  icon="fluent:checkbox-unchecked-16-regular"
                  sx={{
                    width: "24px",
                    height: "24px",
                    color: rgba(theme.palette.primary.main, 0.7),
                  }}
                />
              }
              checkedIcon={
                <Iconify
                  icon="akar-icons:check-box-fill"
                  sx={{
                    width: "24px",
                    height: "24px",
                    color: theme.palette.primary.main,
                  }}
                />
              }
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all",
              }}
            />
          </MyTableCell>
        )}
        {actions && actions?.length > 0 && (
          <TableCell
            id="table-header-cell-2"
            align="center"
            sx={{
              ...options?.tableHeaderStyle?.cellStyle,
            }}
            padding="none"
          >
            <Typography variant="body2" fontWeight={600}>
              Actions
            </Typography>
          </TableCell>
        )}
        {columns.map((column, i) => (
          <MyTableCell
            id={`table-header-cell-${i + 3}`}
            sx={options?.tableHeaderStyle?.cellStyle}
            key={i}
            align={column.align}
            padding={column.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === column.id ? order : false}
          >
            {column.sorting == null || column.sorting ? (
              <MyTableSortLabel
                id={`table-header-cell-${i + 3}-sort-label`}
                active={orderBy === column.field}
                direction={orderBy === column.field ? order : "asc"}
                onClick={createSortHandler(column.field)}
                sx={{}}
              >
                {/* <Typography variant="body2" fontWeight={500}> */}
                {column.title}
                {/* </Typography> */}
              </MyTableSortLabel>
            ) : (
              <Typography
                id={`table-header-cell-${i + 3}-title`}
                variant="body2"
                fontWeight={600}
                color="primary"
              >
                {column.title}
              </Typography>
            )}
            <Box height={1} />
          </MyTableCell>
        ))}
      </MyTableRow>
    </MyTableHead>
  );
}

export default function MyDataTable({
  title,
  subtitle,
  data,
  columns,
  filterOptions,
  options,
  tableRef,
  onRowClick,
  actions,
  tools,
  toolsLeft,
  selectable = true,
  noDataMsg,
  filterChangeListener,
}) {
  const csvRef = useRef(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState(null);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(options?.pageSize ?? 50);
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [exportData, setExportData] = useState([]);
  const [filter, setFilter] = useState(null);
  const [tempFilter, setTempFilter] = useState(null);

  // loading
  const [isLoading, setLoading] = useState(false);
  const [isExporting, setExporting] = useState(false);

  const theme = useTheme();

  // routers
  const router = useRouter();
  const currentPage = router.query.page;
  const currentFilter = router.query.filter;

  const handleChangePage = (event, newPage) => {
    router.replace({ query: { ...router.query, page: newPage } });
    setPage(parseInt(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleRequestSearch = (search, searchBy) => {
    setSearch(search);
    setSearchBy(searchBy);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // === FILTER ====
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const openFilterMenu = Boolean(filterAnchorEl);
  const handleOpenFilterMenu = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleCloseFilterMenu = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = () => {
    router.replace({
      query: { ...router.query, filter: JSON.stringify(filter) },
    });
  };
  useEffect(() => {
    handleFilterChange();
  }, [filter]);

  // ==== EXPORT DATA ====
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const openExportMenu = Boolean(exportAnchorEl);
  const handleOpenExportMenu = (event) => {
    setExportAnchorEl(event.currentTarget);
  };
  const handleCloseExportMenu = () => {
    setExportAnchorEl(null);
  };
  const handleExportDataCSV = async () => {
    const tempColumns = columns.filter((column) => column.export != false);

    const rowData = rows.map((row) => {
      return tempColumns.map((column) => {
        if (column.exportValue) {
          return column.exportValue(row);
        } else if (column.render) {
          return column.render(row);
        } else {
          return row[column.field];
        }
      });
    });
    console.log("data", rowData);
    setExportData(rowData);
    return rowData;
  };

  const handleExportSelectedDataCSV = async () => {
    setExporting(true);
    const tempColumns = columns.filter((column) => column.export != false);
    const selectedData = rows.filter((row) => selected.includes(row._id));

    const rowData = selectedData.map((row) => {
      return tempColumns.map((column) => {
        if (column.exportValue) {
          return column.exportValue(row);
        } else if (column.render) {
          return column.render(row);
        } else {
          return row[column.field];
        }
      });
    });
    setExporting(false);
    setExportData(rowData);
    return rowData;
  };
  const handleExportAllDataCSV = async () => {
    setExporting(true);
    setExportData([]);
    const response = await data({
      page: 0,
      pageSize: 1000000,
      orderBy: orderBy,
      order: order,
      search: search,
      searchBy: searchBy,
    });

    const tempColumns = columns.filter((column) => column.export != false);

    // const rowData = response.data.map((row) => {
    //   return tempColumns.map((column) => {
    //     if (column.exportValue) {
    //       return column.exportValue(row);
    //     } else if (column.render) {
    //       return column.render(row);
    //     } else {
    //       return row[column.field];
    //     }
    //   });
    // });
    const rowData = response.data.map((row) => {
      return tempColumns.map((column) => {
        if (column.exportValue) {
          return column.exportValue(row);
        } else if (column.render) {
          return column.render(row);
        } else {
          return row[column.field];
        }
      });
    });
    setExporting(false);
    setExportData(rowData);

    return rowData;
  };

  useEffect(() => {
    if (exportData.length > 0) {
      csvRef.current.link.click();
    }
  }, [exportData]);

  // =======

  // ==== FETCH DATA ====

  const fetchData = async (values, initialFilter) => {
    setSelected([]);

    if (typeof data !== "function") {
      setRows(data ?? []);
      setTotalCount(data?.length ?? 0);
      return;
    }
    setLoading(true);
    console.log("InitialFilter: ", initialFilter, filter);
    if (initialFilter) {
      setFilter(initialFilter);
      setTempFilter(initialFilter);
      values = { ...values, filter: initialFilter };
    } else if (filter) {
      values = { ...values, filter };
    }

    const response = await data({
      page: page,
      pageSize: rowsPerPage,
      orderBy: orderBy,
      order: order,
      search: search,
      searchBy: searchBy,
      ...values,
    });
    if (response) {
      setLoading(false);
      setRows(response.data);
      setTotalCount(response.totalCount);
    }
  };

  useEffect(() => {
    if (currentPage) setPage(parseInt(currentPage));
    if (currentFilter) {
      setFilter(JSON.parse(currentFilter));
      setTempFilter(JSON.parse(currentFilter));
      fetchData(null, JSON.parse(currentFilter));
    } else {
      fetchData();
    }
  }, [currentPage, search, rowsPerPage, order, orderBy]);

  useEffect(() => {
    if (router.query.filter == undefined) return;
    const filterData = JSON.parse(router.query.filter);
    // if (!filterData) return;
    console.log("filter", filterData);
    fetchData(null, filterData);
  }, [router.query.filter]);

  // filter option format
  const filterOptionsFormat = filterOptions?.filter((option) => option);

  // temp filter change
  useEffect(() => {
    if (filterChangeListener) {
      filterChangeListener(tempFilter);
    }
  }, [tempFilter]);

  return (
    <MyTableContainer
      id="my-table-container"
      // component={Paper}
      sx={{
        position: "relative",
        width: "100%",
        ...options?.tableContainerStyle,
      }}
    >
      <MyTableTools
        id="tools"
        sx={{
          ...options?.tableToolbarStyle,
        }}
      >
        {title && (
          <Box id="my-table-tools-title">
            <Typography
              id="my-table-tools-title-text"
              variant="h5"
              sx={{
                ...options?.titleStyle,
              }}
            >
              {title}
            </Typography>
            <Typography
              id="my-table-tools-subtitle"
              variant="subtitle2"
              color="GrayText"
              textOverflow={"ellipsis"}
              sx={{
                ...options?.subtitleStyle,
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        )}
        <Box
          id="my-table-tools-left"
          className="flex"
          mr={2}
          sx={{ maxWidth: "50%", overflowY: "auto" }}
        >
          {toolsLeft && toolsLeft.map((tool, i) => tool && tool?.render())}
        </Box>
        <Box
          id="tools"
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
          }}
        >
          <Box
            id="my-table-tools-search"
            sx={{
              height: "100%",
              display: { xs: "none", sm: "block" },
              height: "40px",
            }}
          >
            {/* === SEARCH BOX ==== */}
            {columns.filter((column) => column.searchable).length > 0 && (
              <SearchBox
                id="search"
                placeholder="Search here"
                options={columns.filter((column) => column.searchable)}
                search={search}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                handleRequestSearch={handleRequestSearch}
              />
            )}
          </Box>
          {/* ==== FILTER ==== */}
          {filterOptionsFormat && filterOptionsFormat.length > 0 && (
            <MyTableBadge
              id="my-table-tools-filter"
              badgeContent={filter ? Object.keys(filter).length : 0}
              color="primary"
              size="small"
            >
              <MyTableToolButton
                sx={{ marginRight: "10px" }}
                startIcon={<Iconify icon="ion:filter" />}
                id="my-table-tools-filter-button"
                onClick={handleOpenFilterMenu}
              >
                Filter
              </MyTableToolButton>
            </MyTableBadge>
          )}
          {tools && tools.map((tool, i) => tool && tool?.render(selected))}
          {options?.exportButton && (
            <>
              <MyTableToolButton
                startIcon={
                  <Iconify
                    icon={
                      isExporting
                        ? "line-md:downloading-loop"
                        : "tabler:cloud-download"
                    }
                  />
                }
                variant="outlined"
                id="table-export"
                sx={{ mr: 1 }}
                disabled={isExporting}
                onClick={() => {
                  if (selected.length > 0) {
                    handleExportSelectedDataCSV();
                  } else {
                    handleExportAllDataCSV();
                  }
                }}
              >
                Export
              </MyTableToolButton>
            </>
          )}
          {options?.refreshButton && (
            <>
              <MyTableToolButton
                id="my-table-tools-refresh-button"
                sx={{
                  mr: 1,
                  height: "100%",
                  minWidth: "0px",
                }}
                onClick={() => tableRef.current.fetchData()}
              >
                <Iconify
                  icon={
                    isLoading
                      ? "eos-icons:loading"
                      : "ant-design:reload-outlined"
                  }
                  sx={{
                    fontSize: "1rem",
                    margin: "4px",
                  }}
                />
              </MyTableToolButton>
            </>
          )}
        </Box>
      </MyTableTools>
      <Box
        sx={{
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <MyTable>
          <TableHeader
            options={options}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            search={search}
            searchBy={searchBy}
            onRequestSearch={handleRequestSearch}
            onSelectAllClick={handleSelectAllClick}
            selectable={selectable}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            actions={actions}
            columns={columns}
            rowSelection={options?.rowSelection}
          />
          <MyTableBody
            ref={(ref) => {
              tableRef &&
                (tableRef.current = {
                  ref,
                  ...{
                    getSelectedRows: () => {
                      return {
                        data: rows.filter((row) => selected.includes(row._id)),
                        ids: selected,
                      };
                    },
                    handleChangePage,
                    handleChangeRowsPerPage,
                    handleRequestSort,
                    handleRequestSearch,
                    handleSelectAllClick,
                    fetchData,
                    handleExportDataCSV,
                    handleExportAllDataCSV,
                    handleExportSelectedDataCSV,
                  },
                });
            }}
          >
            {isLoading && (
              <>
                {rows.length == 0 && <Box height={60} />}
                <TableLoading />
              </>
            )}
            {!isLoading && rows.length === 0 && (
              <MyTableRow
                sx={{
                  ...options?.rowStyle,
                }}
              >
                <MyTableCell colSpan={columns.length + 1}>
                  <Box
                    className="flex align-center justify-center"
                    mt={2}
                    mb={2}
                  >
                    <Typography
                      variant="body2"
                      color="GrayText"
                      textAlign="center"
                    >
                      {noDataMsg ?? "No data found"}
                    </Typography>
                  </Box>
                </MyTableCell>
              </MyTableRow>
            )}
            {rows.map((row, index) => {
              const isItemSelected = isSelected(row._id);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <MyTableRow
                  id={`my-table-row-${index}`}
                  hover
                  key={row._id}
                  onClick={(event) => {
                    onRowClick && onRowClick(event, row);
                  }}
                  role="checkbox "
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  selected={isItemSelected}
                  sx={
                    onRowClick
                      ? { cursor: "pointer", ...options?.rowStyle }
                      : { cursor: "default", ...options?.rowStyle }
                  }
                >
                  {selectable &&
                  (options?.rowSelection == null || options?.rowSelection) ? (
                    <MyTableCell
                      id={`my-table-cell-${index}`}
                      padding="none"
                      sx={{
                        ...options?.cellStyle,
                      }}
                    >
                      <MyTableCheckbox
                        icon={
                          <Iconify
                            icon="fluent:checkbox-unchecked-16-regular"
                            sx={{
                              width: "24px",
                              height: "24px",
                              color: rgba(theme.palette.primary.main, 0.7),
                            }}
                          />
                        }
                        checkedIcon={
                          <Iconify
                            icon="akar-icons:check-box-fill"
                            sx={{
                              width: "24px",
                              height: "24px",
                              color: theme.palette.primary.main,
                            }}
                          />
                        }
                        checked={isItemSelected}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClick(event, row._id);
                        }}
                      />
                    </MyTableCell>
                  ) : null}
                  {actions && actions.length > 0 && (
                    <MyTableCell
                      align="center"
                      sx={{
                        ...options?.cellStyle,
                      }}
                    >
                      <Box display="flex">
                        {actions.map((action, j) => {
                          const actionData =
                            typeof action === "function" ? action(row) : action;
                          if (!actionData?.hidden) {
                            return (
                              <Tooltip
                                key={`${row._id}-a-${j}`}
                                title={actionData.title}
                              >
                                <MyTableIconButton
                                  disabled={actionData.disabled}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    actionData.onClick(event, row);
                                  }}
                                  {...actionData.iconProps}
                                  // sx={{ cursor: "pointer" }}
                                >
                                  {actionData?.icon}
                                </MyTableIconButton>
                              </Tooltip>
                            );
                          }
                        })}
                      </Box>
                    </MyTableCell>
                  )}
                  {columns.map((column, j) => {
                    if (column.render) {
                      return (
                        <MyTableCell
                          id={`my-table-cell-${index}-${j}`}
                          key={`${row._id}-b-${j}`}
                          align={column.align}
                          sx={{
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            ...options?.cellStyle,
                          }}
                        >
                          {column.render(row, j)}
                        </MyTableCell>
                      );
                    } else {
                      return (
                        <MyTableCell
                          id={`my-table-cell-${index}-${j}`}
                          key={`${row._id}-c-${j}`}
                          align={column.align}
                          sx={{
                            ...options?.cellStyle,
                          }}
                        >
                          {row[column.field]}
                        </MyTableCell>
                      );
                    }
                  })}
                </MyTableRow>
              );
            })}
          </MyTableBody>
        </MyTable>
      </Box>

      {(options?.pagination == null || options?.pagination) && (
        <MyTablePagination
          id="my-table-pagination"
          rowsPerPageOptions={options?.pageSizeOptions ?? [50, 100, 150]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      {/* ==== EXPORT ==== */}
      <CSVLink
        asyncOnClick={true}
        data={exportData}
        headers={columns
          ?.map((column) => {
            if (column.export != false) return column.title;
            // return {
            //   label: column.title,
            //   key: column.field,
            // };
          })
          .filter((column) => column)}
        filename={`${title ?? "data"}-${moment().format("DD-MM-yyyy")}.csv`}
        className="hidden"
        ref={csvRef}
        target="_blank"
      />
      <MyTableFilterMenu
        id="filter-menu"
        anchorEl={filterAnchorEl}
        open={openFilterMenu}
        onClose={handleCloseFilterMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{ minWidth: "300px" }}
      >
        <Typography variant="h6">Filter by</Typography>
        {filterOptionsFormat?.map((option, i) => {
          return (
            <>
              <Typography variant="body2" fontWeight={500} mt={1} mb={1}>
                {option.label}
              </Typography>
              {option.type === "select" ? (
                <MyPrimarySelect
                  sx={{ width: "100%", padding: "10px" }}
                  defaultValue={"all"}
                  value={tempFilter?.[option.field] ?? "all"}
                  onChange={(e) => {
                    setTempFilter({
                      ...tempFilter,
                      [option.field]: e.target.value,
                    });
                  }}
                  placeholder={option.placeholder}
                >
                  <option value="all" disabled selected hidden>
                    <em>All</em>
                  </option>
                  {option?.options?.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </MyPrimarySelect>
              ) : (
                <MyTableTextField
                  size="small"
                  type={option.type ?? "text"}
                  onChange={(e) => {
                    setTempFilter({
                      ...tempFilter,
                      [option.name]: e.target.value,
                    });
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    setTempFilter({
                      ...tempFilter,
                      [option.name]: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ width: "17px" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </>
          );
        })}

        <Box className="flex space-between" mt={2} mb={2}>
          <PrimaryButton
            id="my-table-filter-reset-button"
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={() => {
              setFilter(null);
              setTempFilter(null);
            }}
          >
            Reset
          </PrimaryButton>
          <PrimaryButton
            id="my-table-filter-apply-button"
            variant="contained"
            onClick={() => {
              setFilter(tempFilter);
              handleCloseFilterMenu();
            }}
          >
            Apply Filter
          </PrimaryButton>
        </Box>
      </MyTableFilterMenu>

      {/* ==== EXPORT MENU ==== */}
      <MyTableFilterMenu
        id="export-menu"
        sx={{ display: "none" }}
        anchorEl={exportAnchorEl}
        open={openExportMenu}
        onClose={handleCloseExportMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          id="my-table-export-menu-item"
          onClick={() => {
            if (selected.length > 0) {
              tableRef?.current?.handleExportSelectedDataCSV();
            } else {
              tableRef?.current?.handleExportAllDataCSV();
            }
          }}
        >
          Export as CSV
        </MenuItem>
      </MyTableFilterMenu>
    </MyTableContainer>
  );
}

import { rgba } from "emotion-rgba";
import {
  Box,
  Badge,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Checkbox,
  TableSortLabel,
  TextField,
  IconButton,
  Select,
  Menu,
  TablePagination,
  MenuItem,
  Typography,
} from "@mui/material";
import { emphasize, styled } from "@mui/material/styles";
import Iconify from "@/components/common/Iconify";
import { useState } from "react";

// ==== TABLE CONTAINER =====
export const MyTableContainer = styled(TableContainer)(({ theme }) => ({
  //   padding: theme.spacing(2),
  borderRadius: "7.51px",
  boxShadow: `0px 1px 1px ${theme.palette.divider}`,
  transition: "background-color 0.3s",
}));

export const MyTableTools = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

export const MyTableHead = styled(TableHead)(({ theme }) => ({
  minWidth: "100%",
  backgroundColor: rgba(theme.palette.primary.main, 0.1),
  // backgroundColor: emphasize(theme.palette.action.selected, 0.7),
  "tr > th": {
    padding: theme.spacing(1.2, 2),
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
}));

export const MyTableToolButton = styled(Button)(({ theme, variant }) => ({
  minWidth: theme.spacing(10),
  textTransform: "none",
  borderRadius: "7.51px",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  borderColor: theme.palette.divider,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: rgba(theme.palette.primary.main, 0.2),
    // backgroundColor: emphasize(
    //   theme.palette.action.selected,
    //   theme.palette.action.hoverOpacity
    // ),
    borderColor: theme.palette.divider,
  },
}));

export const MyTableCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: theme.spacing(0),
  boxSizing: "border-box",
}));

export const MyTableRow = styled(TableRow)(({ theme }) => ({}));

export const MyTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

export const MyTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

export const MyTableTextField = styled(TextField)(({ theme }) => ({
  ".MuiInputBase-root": {
    fontSize: "12px !important",
    paddingLeft: "10px !important",
    ".MuiInputBase-input": {
      padding: "5px !important",
    },
  },
}));

export const MyTable = styled(Table)(({ theme }) => ({}));
export const MyTableBody = styled(TableBody)(({ theme }) => ({
  position: "relative",
}));
export const MyTableIconButton = styled(IconButton)(({ theme }) => ({}));

export const MyTablePagination = styled(TablePagination)(({ theme }) => ({}));

export const MyTableFilterMenu = styled(Menu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "14px",
    padding: "0px 10px",
    minWidth: "200px",
  },
}));

export const SearchBox = ({
  placeholder,
  options,
  search,
  searchBy,
  setSearchBy,
  handleRequestSearch,
}) => {
  const [searchFieldText, setSearchFieldText] = useState("");
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        marginRight: "12px",
        boxSizing: "border-box",
      }}
    >
      <Select
        sx={{
          boxShadow: "none",
          border: "none",
          borderRight: "1px solid transparent",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          borderTopRightRadius: "0px",
          borderBottomRightRadius: "0px",
          marginRight: "-2px",
          border: "1px solid transparent !important",

          padding: "0px !important",
          "& .MuiSelect-select": {
            border: "none !important",
            padding: "0px 12px",
            minWidth: "50px",
            minHeight: " 0px !important",
          },
          "&: focus": {
            border: "none",
          },
          "&: hover": {
            padding: "0px 12px",
            border: "1px solid transparent !important",
          },

          "& .MuiInputBase-root": {
            padding: "0px",
            "&: hover": {
              padding: "0px !important",
              border: "1px solid red !important",
            },
          },
          "& .MuiOutlinedInput-select": {
            "&: hover": {
              padding: "0px 12px",
              border: "1px solid red !important",
            },
          },
        }}
        value={searchBy ? searchBy : options[0].field}
        defaultValue={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
      >
        {options.map((option, i) => (
          <MenuItem key={i} value={option.field}>
            <Typography variant="body2" fontWeight={500}>
              {option.title}
            </Typography>
          </MenuItem>
        ))}
      </Select>
      <MyTableTextField
        id="search"
        variant="outlined"
        size="small"
        placeholder={placeholder}
        fullWidth
        InputProps={{
          startAdornment: (
            <IconButton
              size="small"
              onClick={() => {
                handleRequestSearch(
                  searchFieldText,
                  searchBy ? searchBy : options[0].field
                );
              }}
            >
              <Iconify icon="bx:bx-search" />
            </IconButton>
          ),
        }}
        sx={{
          "& .MuiInputBase-root": {
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "8px",
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            height: "100%",
            border: "1px solid transparent !important",
            "&: hover": {
              border: "1px solid transparent !important",
            },
            minHeight: "none",
          },
        }}
        onChange={(e) => setSearchFieldText(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          handleRequestSearch(
            e.target.value,
            searchBy ? searchBy : options[0].field
          )
        }
      />
    </Box>
  );
};

export const MyTableBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    zIndex: "0 !important",
    right: "22px",
  },
}));

export const MyPrimarySelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    padding: "0px 12px",
  },
}));

export const MyPrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

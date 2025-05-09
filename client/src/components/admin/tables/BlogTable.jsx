import MyDataTable, { MyTableToolButton } from "mui-datatable";
import Iconify from "@/components/common/Iconify";
import { useState, useRef, useContext } from "react";
import moment from "moment";
import AlertDialog from "@/components/common/AlertDialog";
import { useRouter } from "next/router";
// ==== IMPORT ACTIONS ====
import {
  getBlogPosts,
  deleteMultipleBlogPosts,
} from "@/redux/actions/admin/blogActions";
import StoreHooks from "@/redux/contextProvider/storeHooks";

const BlogTable = () => {
  const tableRef = useRef();
  const storeHooks = useContext(StoreHooks);
  const router = useRouter();

  // ==== ALERT ====
  const [action, setAction] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
    setSelectedData([]);
  };

  const dialogAction = async () => {
    if (action === "MULTIPLE-DELETE") {
      const res = await deleteMultipleBlogPosts(
        { ids: selectedData },
        storeHooks
      );
      if (res.status == 200) {
        tableRef.current.fetchData();
      }
    }
  };

  return (
    <>
      <MyDataTable
        tableRef={tableRef}
        title="Blog Posts"
        columns={[
          { title: "Title", field: "title", searchable: true },
          { title: "Movie", field: "movie", searchable: true },
          { title: "Director", field: "director", searchable: true },
          {
            title: "Created At",
            field: "createdAt",
            render: (row) => {
              return <span>{moment(row.createdAt).format("DD-MM-YYYY")}</span>;
            },
          },
          { title: "Status", field: "status" },
        ]}
        data={(query) =>
          new Promise((resolve, reject) => {
            getBlogPosts(query)
              .then((response) => response.data)
              .then((result) => {
                console.log("result", result);
                resolve({
                  data: result.data,
                  page: result.page,
                  totalCount: result.total,
                });
              })
              .catch((err) => {
                reject(err);
              });
          })
        }
        actions={[
          {
            icon: <Iconify icon="mdi:edit-outline" />,
            tooltip: "Edit",
            iconProps: { color: "success" },
            onClick: (event, rowData) => {
              router.push({
                pathname: `/admin/blog/edit`,
                query: { id: rowData._id },
              });
            },
          },
        ]}
        tools={[
          {
            title: "Delete",
            render: (selected) => {
              return (
                <MyTableToolButton
                  startIcon={<Iconify icon="material-symbols:add-rounded" />}
                  sx={{ mr: 1 }}
                  onClick={() => {
                    router.push({
                      pathname: `/admin/blog/add`,
                    });
                  }}
                >
                  Add
                </MyTableToolButton>
              );
            },
          },
          {
            title: "Delete",
            render: (selected) => {
              return (
                <MyTableToolButton
                  startIcon={<Iconify icon="fluent:delete-12-regular" />}
                  sx={{ mr: 1 }}
                  onClick={() => {
                    if (selected.length > 0) {
                      setAction("MULTIPLE-DELETE");
                      setAlertTitle("Delete Users");
                      setAlertMessage(
                        `Are you sure you want to delete ${
                          selected.length == 1
                            ? "the user"
                            : `${selected.length} users`
                        }  ?`
                      );
                      setSelectedData(selected);
                      setOpenAlertDialog(true);
                    } else {
                      storeHooks.handleOpenSnackBar(
                        "Select a user to delete",
                        "warning"
                      );
                    }
                  }}
                >
                  Delete
                </MyTableToolButton>
              );
            },
          },
        ]}
        options={{
          refreshButton: true,
          exportButton: true,
        }}
      />
      <AlertDialog
        openDialog={openAlertDialog}
        handleCloseDialog={handleCloseAlertDialog}
        alertTitle={alertTitle}
        alertMessage={alertMessage}
        dialogAction={dialogAction}
      />
    </>
  );
};

export default BlogTable;

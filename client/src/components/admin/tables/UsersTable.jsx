import MyDataTable from "@/components/common/MyTable";
import Iconify from "@/components/common/Iconify";
import { MyTableToolButton } from "@/styles/mui/tableComponents";
import { useState, useRef, useContext } from "react";
import moment from "moment";
import AlertDialog from "@/components/common/AlertDialog";

// ==== IMPORT ACTIONS ====
import { getUsers, deleteMultipleUsers } from "@/redux/actions/userActions";
import StoreHooks from "@/redux/contextProvider/storeHooks";

const UsersTable = () => {
  const tableRef = useRef();
  const storeHooks = useContext(StoreHooks);

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
      const res = await deleteMultipleUsers({ ids: selectedData }, storeHooks);
      if (res.status == 200) {
        tableRef.current.fetchData();
      }
    }
  };

  return (
    <>
      <MyDataTable
        tableRef={tableRef}
        title="Users"
        columns={[
          { title: "Name", field: "name" },
          { title: "Role", field: "role" },
          { title: "Phone", field: "phone" },
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
            getUsers(query)
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
        tools={[
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

export default UsersTable;

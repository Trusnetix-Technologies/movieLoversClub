import MyDataTable from "@/components/common/MyTable";
import { useState, useContext, useRef } from "react";
import moment from "moment";
// ==== IMPORT ACTIONS ====
import { getUsers } from "@/redux/actions/userActions";

const UsersTable = () => {
  const tableRef = useRef();

  return (
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
      options={{
        refreshButton: true,
        exportButton: true,
      }}
    />
  );
};

export default UsersTable;

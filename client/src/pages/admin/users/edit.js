// ==== IMPORT COMPONENTS ====
import PageWrapper from "@/components/common/PageWrapper";
import EditUser from "@/components/admin/users/Edit";
export default function EditUserPage() {
  return (
    <PageWrapper
      title="Users"
      description="Users Page"
      selectedMenuItem="Users"
    >
      <EditUser />
    </PageWrapper>
  );
}

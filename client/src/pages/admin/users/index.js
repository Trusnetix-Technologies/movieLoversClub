// ==== IMPORT COMPONENTS ====
import PageWrapper from "@/components/common/PageWrapper";
import Users from "@/components/admin/users/Users";
export default function UsersPage() {
  return (
    <PageWrapper
      title="Users"
      description="Users Page"
      selectedMenuItem="Users"
    >
      <Users />
    </PageWrapper>
  );
}

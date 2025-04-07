// ==== IMPORT COMPONENTS ====
import PageWrapper from "@/components/common/PageWrapper";
import EditBlog from "@/components/admin/blog/Edit";
export default function UsersPage() {
  return (
    <PageWrapper title="Blog" description="Blog Page" selectedMenuItem="Blog">
      <EditBlog />
    </PageWrapper>
  );
}

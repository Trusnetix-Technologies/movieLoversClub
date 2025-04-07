// ==== IMPORT COMPONENTS ====
import PageWrapper from "@/components/common/PageWrapper";
import AddBlog from "@/components/admin/blog/Add";
export default function UsersPage() {
  return (
    <PageWrapper title="Blog" description="Blog Page" selectedMenuItem="Blog">
      <AddBlog />
    </PageWrapper>
  );
}

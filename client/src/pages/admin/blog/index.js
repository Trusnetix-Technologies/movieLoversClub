// ==== IMPORT COMPONENTS ====
import PageWrapper from "@/components/common/PageWrapper";
import Blog from "@/components/admin/blog/Blog";
export default function UsersPage() {
  return (
    <PageWrapper title="Blog" description="Blog Page" selectedMenuItem="Blog">
      <Blog />
    </PageWrapper>
  );
}

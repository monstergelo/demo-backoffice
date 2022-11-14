import AdminLogList from "module/AdminLog";
import BasicLayout from "module/BasicLayout";
import { PageType } from "module/types";
import { ADMIN_LOG as PAGE, getBreadcrumb } from "pageConstant";

const AdminLogListPage: PageType<{}> = AdminLogList;
AdminLogListPage.layout = BasicLayout;
AdminLogListPage.title = PAGE.title;

export const getStaticProps = async () => {

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.title),
    },
    revalidate: 10,
  };
};

export default AdminLogListPage;

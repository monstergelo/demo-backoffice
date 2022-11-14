import Admin, { AdminListProps } from "module/Admin";
import BasicLayout from "module/BasicLayout";
import { PageType } from "module/types";
import { ADMIN as PAGE, getBreadcrumb } from "pageConstant";

const AdminListPage: PageType<AdminListProps> = Admin;
AdminListPage.layout = BasicLayout;
AdminListPage.title = PAGE.title;

export const getStaticProps = async () => {

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.title),
      paths: {
        add: PAGE.ADD.url,
        edit: PAGE.EDIT.url
      }
    },
    revalidate: 10,
  };
};

export default AdminListPage;

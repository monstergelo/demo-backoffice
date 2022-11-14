import Role, { RoleListProps } from "module/Role";
import BasicLayout from "module/BasicLayout";
import { PageType } from "module/types";
import { ROLE as PAGE, getBreadcrumb } from "pageConstant";

const RoleListPage: PageType<RoleListProps> = Role;
RoleListPage.layout = BasicLayout;
RoleListPage.title = PAGE.title;

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

export default RoleListPage;

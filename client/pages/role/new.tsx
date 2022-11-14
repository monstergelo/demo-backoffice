import RoleForm from "module/Role/add";
import BasicLayout from "module/BasicLayout";
import { FormProps, PageType } from "module/types";
import { ROLE as PAGE, getBreadcrumb } from "pageConstant";

const RoleFormPage: PageType<FormProps> = RoleForm;
RoleFormPage.layout = BasicLayout;
RoleFormPage.title = PAGE.ADD.title;

export const getStaticProps = async () => {

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.ADD.title),
      onSubmitRedirect: PAGE.url,
    },
    revalidate: 10,
  };
};

export default RoleFormPage;

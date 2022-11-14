import AdminForm from "module/Admin/add";
import BasicLayout from "module/BasicLayout";
import { FormProps, PageType } from "module/types";
import { ADMIN as PAGE, getBreadcrumb } from "pageConstant";

const AdminFormPage: PageType<FormProps> = AdminForm;
AdminFormPage.layout = BasicLayout;
AdminFormPage.title = PAGE.ADD.title;

export const getStaticProps = async () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [permissionResponse] = await Promise.all([
    fetch(baseURL + '/permission', {
      method: 'GET',
      cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
    }).then((res) => res.json()),
  ]) 

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.ADD.title),
      options: {
        permissions: permissionResponse,
      },
      onSubmitRedirect: PAGE.url,
    },
    revalidate: 10,
  };
};

export default AdminFormPage;

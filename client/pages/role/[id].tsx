import RoleForm from "module/Role/edit";
import BasicLayout from "module/BasicLayout";
import { FormProps, PageType } from "module/types";
import { ROLE as PAGE, getBreadcrumb } from "pageConstant";

const RoleFormPage: PageType<FormProps> = RoleForm;
RoleFormPage.layout = BasicLayout;
RoleFormPage.title = PAGE.EDIT.title;

export const getServerSideProps = async ({ params }: any) => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(baseURL + '/role/' + params?.id, {
    method: 'GET',
    cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
  }).then((res) => res.json());

  var breadcrumb = getBreadcrumb(PAGE.EDIT.title);
  breadcrumb[2] = {
    ...breadcrumb[2],
    query: {
      id: params?.id
    }
  }

  return {
    props: {
      breadcrumb: breadcrumb,
      onSubmitRedirect: PAGE.url,
      data: response ?? {},
      id: params?.id,
    },
  };
};

export default RoleFormPage;

import DisbursementForm from "module/Disbursement/edit";
import BasicLayout from "module/BasicLayout";
import { FormProps, PageType } from "module/types";
import { DISBURSEMENT as PAGE, getBreadcrumb } from "pageConstant";

const DisbursementFormPage: PageType<FormProps> = DisbursementForm;
DisbursementFormPage.layout = BasicLayout;
DisbursementFormPage.title = PAGE.EDIT.title;

export const getServerSideProps = async ({ params }: any) => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(baseURL + '/disbursement/' + params?.id, {
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

export default DisbursementFormPage;

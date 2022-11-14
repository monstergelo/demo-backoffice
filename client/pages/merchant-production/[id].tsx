import MerchantForm from "module/Merchant/edit";
import BasicLayout from "module/BasicLayout";
import { FormProps, PageType } from "module/types";
import { MERCHANT_PRODUCTION as PAGE, getBreadcrumb } from "pageConstant";

const MerchantFormPage: PageType<FormProps> = MerchantForm;
MerchantFormPage.layout = BasicLayout;
MerchantFormPage.title = PAGE.EDIT.title;

export const getServerSideProps = async ({ params }: any) => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(baseURL + '/merchant/' + params?.id, {
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
      type: 'PRODUCTION',
    },
  };
};

export default MerchantFormPage;

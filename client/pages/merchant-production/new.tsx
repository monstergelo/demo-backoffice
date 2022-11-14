import MerchantForm from "module/Merchant/add";
import BasicLayout from "module/BasicLayout";
import { FormProps, PageType } from "module/types";
import { MERCHANT_PRODUCTION as PAGE, getBreadcrumb } from "pageConstant";

const MerchantFormPage: PageType<FormProps> = MerchantForm;
MerchantFormPage.layout = BasicLayout;
MerchantFormPage.title = PAGE.ADD.title;

export const getStaticProps = async () => {

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.ADD.title),
      onSubmitRedirect: PAGE.url,
      type: 'PRODUCTION',
    },
    revalidate: 10,
  };
};

export default MerchantFormPage;

import MerchantForm from "module/Merchant/add";
import BasicLayout from "module/BasicLayout";
import { FormProps, PageType } from "module/types";
import { MERCHANT_SANDBOX as PAGE, getBreadcrumb } from "pageConstant";

const MerchantFormPage: PageType<FormProps> = MerchantForm;
MerchantFormPage.layout = BasicLayout;
MerchantFormPage.title = PAGE.ADD.title;

export const getStaticProps = async () => {

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.ADD.title),
      onSubmitRedirect: PAGE.url,
      type: 'SANDBOX',
    },
    revalidate: 10,
  };
};

export default MerchantFormPage;

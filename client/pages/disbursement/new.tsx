import DisbursementForm from "module/Disbursement/add";
import BasicLayout from "module/BasicLayout";
import { FormProps, PageType } from "module/types";
import { DISBURSEMENT as PAGE, getBreadcrumb } from "pageConstant";

const DisbursementFormPage: PageType<FormProps> = DisbursementForm;
DisbursementFormPage.layout = BasicLayout;
DisbursementFormPage.title = PAGE.ADD.title;

export const getStaticProps = async () => {

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.ADD.title),
      onSubmitRedirect: PAGE.url,
    },
    revalidate: 10,
  };
};

export default DisbursementFormPage;

import Disbursement, { DisbursementListProps } from "module/Disbursement";
import BasicLayout from "module/BasicLayout";
import { PageType } from "module/types";
import { DISBURSEMENT as PAGE, getBreadcrumb } from "pageConstant";

const DisbursementListPage: PageType<DisbursementListProps> = Disbursement;
DisbursementListPage.layout = BasicLayout;
DisbursementListPage.title = PAGE.title;

export const getStaticProps = async () => {

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.title),
    },
    revalidate: 10,
  };
};

export default DisbursementListPage;

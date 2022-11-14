import Merchant, { MerchantListProps } from "module/Merchant";
import BasicLayout from "module/BasicLayout";
import { PageType } from "module/types";
import { MERCHANT_PRODUCTION as PAGE, getBreadcrumb } from "pageConstant";

const MerchantListPage: PageType<MerchantListProps> = Merchant;
MerchantListPage.layout = BasicLayout;
MerchantListPage.title = PAGE.title;

export const getStaticProps = async () => {

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.title),
      paths: {
        add: PAGE.ADD.url,
        edit: PAGE.EDIT.url
      },
      type: 'PRODUCTION',
    },
    revalidate: 10,
  };
};

export default MerchantListPage;

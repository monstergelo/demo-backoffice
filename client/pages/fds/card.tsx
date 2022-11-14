import FDSCardTracking from "module/FDS/card-tracking";
import BasicLayout from "module/BasicLayout";
import { PageType } from "module/types";
import { FDS as PAGE, getBreadcrumb } from "pageConstant";

const FDSCardTrackingPage: PageType<{}> = FDSCardTracking;
FDSCardTrackingPage.layout = BasicLayout;
FDSCardTrackingPage.title = PAGE.CARD.title;

export const getStaticProps = async () => {

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.CARD.title),
    },
    revalidate: 10,
  };
};

export default FDSCardTrackingPage;

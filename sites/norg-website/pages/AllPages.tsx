
import Head from 'next/head'
import { buildMegaMenu } from '../components/MegaMenu';
import Pages from '../views/pages';
import { NorgLayout } from '../views/layout';

export function AllPages<HomepageProps>({ data }) {
  return (
    <NorgLayout
      className={"flex w-full flex-col items-center"}
      data={data}
      isMegamenu={true}
      megaMenuMenu={buildMegaMenu(data?.data?.navItems, data?.data?.stickyNavItems, data?.data?.languageSite)}
    >
      <Pages
        className={
          "mx-auto"
        }
        data={data}
      />
    </NorgLayout>
  )
}


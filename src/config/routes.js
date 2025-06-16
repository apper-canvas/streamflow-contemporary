import Browse from '@/components/pages/Browse';
import MyList from '@/components/pages/MyList';
import Search from '@/components/pages/Search';
import Watch from '@/components/pages/Watch';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/',
    icon: 'Home',
    component: Browse
  },
  myList: {
    id: 'myList',
    label: 'My List',
    path: '/my-list',
    icon: 'Bookmark',
    component: MyList
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search
  },
  watch: {
    id: 'watch',
    label: 'Watch',
    path: '/watch/:id',
    icon: 'Play',
    component: Watch,
    hideInNav: true
  }
};

export const routeArray = Object.values(routes);
export default routes;
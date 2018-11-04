import Projects from './projects/projects';
import Blog from './blog/blog';
import Contact from './contact/contact';

export const title = 'jared goguen | explore';

export const root = '/';

export const headerItems = [
  {
    name: 'projects',
    path: '/projects/',
    component: Projects,
    options: {}
  }, {
    name: 'blog',
    path: '/blog/',
    component: Blog,
    options: {}
  }, {
    name: 'contact',
    path: '/contact/',
    component: Contact,
    options: {
      border: true
    }
  }
];

import Home from './home/home';
import Projects from './projects/projects';
import Blog from './blog/blog';
import Contact from './contact/contact';

export const rootItem = {
  title: 'jared goguen | explore',
  path: '/',
  component: Home,
};

export const headerItems = [
  {
    title: 'projects',
    path: '/projects/',
    component: Projects,
    options: {}
  }, {
    title: 'blog',
    path: '/blog/',
    component: Blog,
    options: {}
  }, {
    title: 'contact',
    path: '/contact/',
    component: Contact,
    options: {
      border: true
    }
  }
];

export const flipTime = 500;

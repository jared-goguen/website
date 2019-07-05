import Home from './home/home';
import Projects from './projects/projects';
import Blog from './blog/blog';
import BlogPost from './blog/blog_post';
import Contact from './contact/contact';

export const flipTime = 1000;
export const postsPath = 'posts';

export const rootItem = {
  title: 'jared goguen',
  path: '/',
  component: Home,
};

export const headerRoutes = [
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
    options: {}
  }
];

export const subRoutes = [
  {
    title: 'posts',
    path: `/blog/${postsPath}/:name`,
    component: BlogPost,
    options: {}
  }
];
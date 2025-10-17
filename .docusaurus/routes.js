import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/gitbook/blog',
    component: ComponentCreator('/gitbook/blog', '15f'),
    exact: true
  },
  {
    path: '/gitbook/blog/archive',
    component: ComponentCreator('/gitbook/blog/archive', '037'),
    exact: true
  },
  {
    path: '/gitbook/blog/authors',
    component: ComponentCreator('/gitbook/blog/authors', '1f3'),
    exact: true
  },
  {
    path: '/gitbook/blog/authors/all-sebastien-lorber-articles',
    component: ComponentCreator('/gitbook/blog/authors/all-sebastien-lorber-articles', '853'),
    exact: true
  },
  {
    path: '/gitbook/blog/authors/yangshun',
    component: ComponentCreator('/gitbook/blog/authors/yangshun', 'df1'),
    exact: true
  },
  {
    path: '/gitbook/blog/first-blog-post',
    component: ComponentCreator('/gitbook/blog/first-blog-post', 'c55'),
    exact: true
  },
  {
    path: '/gitbook/blog/long-blog-post',
    component: ComponentCreator('/gitbook/blog/long-blog-post', 'f2c'),
    exact: true
  },
  {
    path: '/gitbook/blog/mdx-blog-post',
    component: ComponentCreator('/gitbook/blog/mdx-blog-post', 'cd3'),
    exact: true
  },
  {
    path: '/gitbook/blog/tags',
    component: ComponentCreator('/gitbook/blog/tags', '021'),
    exact: true
  },
  {
    path: '/gitbook/blog/tags/docusaurus',
    component: ComponentCreator('/gitbook/blog/tags/docusaurus', '93b'),
    exact: true
  },
  {
    path: '/gitbook/blog/tags/facebook',
    component: ComponentCreator('/gitbook/blog/tags/facebook', 'cbe'),
    exact: true
  },
  {
    path: '/gitbook/blog/tags/hello',
    component: ComponentCreator('/gitbook/blog/tags/hello', 'ff1'),
    exact: true
  },
  {
    path: '/gitbook/blog/tags/hola',
    component: ComponentCreator('/gitbook/blog/tags/hola', '19e'),
    exact: true
  },
  {
    path: '/gitbook/blog/welcome',
    component: ComponentCreator('/gitbook/blog/welcome', '628'),
    exact: true
  },
  {
    path: '/gitbook/markdown-page',
    component: ComponentCreator('/gitbook/markdown-page', '354'),
    exact: true
  },
  {
    path: '/gitbook/docs',
    component: ComponentCreator('/gitbook/docs', '7fa'),
    routes: [
      {
        path: '/gitbook/docs',
        component: ComponentCreator('/gitbook/docs', '9f7'),
        routes: [
          {
            path: '/gitbook/docs',
            component: ComponentCreator('/gitbook/docs', '95b'),
            routes: [
              {
                path: '/gitbook/docs/category/tutorial---basics',
                component: ComponentCreator('/gitbook/docs/category/tutorial---basics', 'ae4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/category/tutorial---extras',
                component: ComponentCreator('/gitbook/docs/category/tutorial---extras', '5a2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/hello',
                component: ComponentCreator('/gitbook/docs/hello', 'e3c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/intro',
                component: ComponentCreator('/gitbook/docs/intro', '219'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/gitbook/docs/tutorial-basics/congratulations', '926'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/gitbook/docs/tutorial-basics/create-a-blog-post', '45b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/gitbook/docs/tutorial-basics/create-a-document', '564'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/gitbook/docs/tutorial-basics/create-a-page', 'c77'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/gitbook/docs/tutorial-basics/deploy-your-site', 'cdb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/gitbook/docs/tutorial-basics/markdown-features', 'a3e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/gitbook/docs/tutorial-extras/manage-docs-versions', 'a3f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/gitbook/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/gitbook/docs/tutorial-extras/translate-your-site', 'c3f'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/gitbook/',
    component: ComponentCreator('/gitbook/', '544'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];

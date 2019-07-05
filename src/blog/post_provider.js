export const blogPostNames = [
    'website_setup',
    'header_and_router',
    'styling_take_1',
    'enabling_markdown'
];

const blogPosts = {};
blogPostNames.forEach(async name => {
    const module = await import(/* webpackMode: "eager" */ `Assets/blog/posts/${name}.md`)
    blogPosts[name] = module.default;
});

export const postProvider = name => blogPosts[name];
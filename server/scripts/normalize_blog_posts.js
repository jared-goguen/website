const path = require('path');
const fs = require('fs');
const BlogPost = require('../blog_post');

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const addPost = async file => {
    const parts = file.split('_');
    const id = Number.parseInt(parts.shift());

    const title = parts.map(capitalize).join(' ');

    const relativeFile = `../../assets/blog/posts/${file}.md`
    const stats = fs.statSync(path.resolve(__dirname, relativeFile))
    const date = stats.birthtime;

    const post = new BlogPost({id, title, date, file});
    await post.save();
}

const normalizePosts = async () => {
    const posts = await BlogPost.find({});
    const postFiles = new Set(posts.map(post => path.basename(post.file, '.md')));

    const filesWithExtensions = fs.readdirSync(path.resolve(__dirname, '../../assets/blog/posts'));
    const files = filesWithExtensions.map(file => path.basename(file, '.md'));

    for (const file of files) {
        if (!postFiles.has(file)) {
            await addPost(file);
        }
    }
};

module.exports = exports = normalizePosts;

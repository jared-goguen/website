const mongcon = require('./mongcon');

const root = '/assets/blog/posts'; 

const blogPostSchema = new mongcon.Schema({
  id: { type: Number, min: 1},
  title: { type: String},
  date: { type: Date },
  file: { 
    type: String,
    get: value => `${root}/${value}.md`
  }
});

module.exports = exports = new mongcon.model('BlogPost', blogPostSchema);

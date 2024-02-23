const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.reduce((x, y) => x + y.likes, 0)
    return likes
}

const favouriteBlog = (blogs) => {
    const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes ? prev : current), {})
    return favorite
}

const mostBlogs = (blogs) => {

    let checked = []
    let mostBlogsCount = []

    const getCount = (author) => {
        return blogs.filter((blog) => blog.author === author).length
    }

    blogs.map((blog) => { 
        if (checked.find((author) => author === blog.author)) {
            return
        } else {
            mostBlogsCount.push({
                author: blog.author,
                blogs: getCount(blog.author)
            })    
            checked.push(blog.author)
        } 
    })

    return mostBlogsCount.reduce((prev, current) => (prev.blogs > current.blogs ? prev : current), {})

}

const mostLikes = (blogs) => {
    const authors = _.groupBy(blogs, 'author');

    const authorLikes = _.map(authors, (blogs, author) => {
        const totalLikes = _.sumBy(blogs, 'likes');
        return { author, likes: totalLikes };
    });

    const mostLikedAuthor = _.maxBy(authorLikes, 'likes');

    return mostLikedAuthor
};

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}
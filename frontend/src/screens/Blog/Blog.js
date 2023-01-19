import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import './Blog.scss';

const BlogPost = () => {
  const [blogPosts, setBlogPosts] = useState(null);

  const query = `
  {
  blogPostCollection{
    items{
     title
      slug
      description
      body{
        json
      }
      publishedDate
      featuredImage{
        url
      }
    }
  }
}
  `;

  useEffect(() => {
    window
      .fetch(
        `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_CONTENTFUL_SPACE_ID}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authenticate the request
            Authorization: `Bearer ${process.env.REACT_APP_CONTENTFUL_TOKEN}`,
          },
          // send the GraphQL query
          body: JSON.stringify({ query }),
        }
      )
      .then((response) => response.json())
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors);
        }

        // rerender the entire component with new data
        setBlogPosts(data.blogPostCollection.items);
      });
  }, []);

  return (
    <Col className='posts__container'>
      {blogPosts ? (
        blogPosts.map((post) => {
          return (
            <Row className='my-3'>
              <Link className='posts__post' key={post.slug} to={post.slug}>
                <div className='posts__post__img__container'>
                  <img
                    className='posts__post__img__container__img'
                    src={post.featuredImage.url}
                    alt={post.title}
                  />
                </div>
                <small>{new Date(post.publishedDate).toDateString()}</small>
                <h3>{post.title}</h3>
                <p>{`${post.description.substring(0, 175)}...`}</p>
              </Link>
            </Row>
          );
        })
      ) : (
        <div>Loading</div>
      )}
    </Col>
  );
};

export default BlogPost;

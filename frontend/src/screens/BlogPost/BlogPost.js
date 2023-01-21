import { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { usePosts } from '../../custom-hooks/';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import './BlogPost.scss';

const BlogPost = () => {
  const [blogPosts, isLoading] = usePosts();
  const [postToUse, setPostToUse] = useState(null);

  const { pathname } = useLocation();
  const routeSlug = pathname.split('/').slice(-1)[0];

  console.log(postToUse, isLoading);
  useEffect(() => {
    if (blogPosts) {
      setPostToUse(blogPosts.filter((post) => post.slug === routeSlug)[0]);
    }
  }, [blogPosts]);

  const renderPost = () => {
    if (isLoading) return <p>Loading...</p>;

    return postToUse ? (
      <Container>
        <Col className='post__col'>
          <div className='post__intro'>
            <h1 className='post__intro__title'>{postToUse.title}</h1>
            <div className='post__author__section'>
              <div>
                <img
                  className='post__author__headshot'
                  src={postToUse.author.headshot.url}
                />
                <p className='post__author__name'>{postToUse.author.name}</p>
              </div>
              <small className='post__intro__date'>
                {new Date(postToUse.publishedDate).toDateString()}
              </small>
            </div>
          </div>

          <div className='post__body'>
            {documentToReactComponents(postToUse.body.json)}
          </div>
        </Col>
      </Container>
    ) : (
      <p>Loading...</p>
    );
  };

  return <div className='post'>{renderPost()}</div>;
};

export default BlogPost;

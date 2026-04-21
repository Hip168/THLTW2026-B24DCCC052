import { Card, Col, Input, Pagination, Row, Tag as AntTag, Typography } from 'antd';
import debounce from 'lodash/debounce';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { connect, history } from 'umi';
import type { PostModelState } from '@/models/blog/post';
import type { TagModelState } from '@/models/blog/tag';
import type { Post, Tag } from '@/types/blog';

const { Meta } = Card;
const { Paragraph, Text } = Typography;

interface TrangChuProps {
  blogPost: PostModelState;
  blogTag: TagModelState;
  dispatch: (action: { type: string; payload?: Record<string, unknown> }) => void;
}

const TrangChu: React.FC<TrangChuProps> = ({ blogPost, blogTag, dispatch }) => {
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const fetchPosts = useCallback(
    (params: { page: number; keyword: string; tag: string }) => {
      dispatch({
        type: 'blogPost/fetchList',
        payload: { page: params.page, pageSize: 9, keyword: params.keyword, tag: params.tag },
      });
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch({ type: 'blogTag/fetchList' });
  }, [dispatch]);

  useEffect(() => {
    fetchPosts({ page, keyword, tag: selectedTag });
  }, [page, keyword, selectedTag, fetchPosts]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setKeyword(value);
      setPage(1);
    }, 300),
    [],
  );

  const handleTagClick = (tagId: string) => {
    setSelectedTag((prev) => (prev === tagId ? '' : tagId));
    setPage(1);
  };

  const getTagName = (tagId: string) => {
    const found = blogTag.list.find((t: Tag) => t.id === tagId);
    return found ? found.name : tagId;
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <Input.Search
          placeholder="Tìm kiếm bài viết..."
          allowClear
          style={{ width: 320 }}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        <div>
          {blogTag.list.map((tag: Tag) => (
            <AntTag
              key={tag.id}
              color={selectedTag === tag.id ? '#CC0D00' : 'default'}
              style={{ cursor: 'pointer', marginBottom: 4 }}
              onClick={() => handleTagClick(tag.id)}
            >
              {tag.name}
            </AntTag>
          ))}
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {blogPost.list.map((post: Post) => (
          <Col key={post.id} span={8}>
            <Card
              hoverable
              cover={
                <img
                  alt={post.title}
                  src={post.thumbnail}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
              onClick={() => history.push(`/blog/${post.slug}`)}
              style={{ height: '100%' }}
            >
              <Meta
                title={
                  <Text strong style={{ fontSize: 15 }}>
                    {post.title}
                  </Text>
                }
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8, color: '#666' }}>
                      {post.summary}
                    </Paragraph>
                    <div style={{ marginBottom: 8 }}>
                      {post.tags.map((tagId) => (
                        <AntTag
                          key={tagId}
                          color="red"
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagClick(tagId);
                          }}
                        >
                          {getTagName(tagId)}
                        </AntTag>
                      ))}
                    </div>
                    <div style={{ color: '#999', fontSize: 12 }}>
                      <span>{post.author}</span>
                      <span style={{ margin: '0 8px' }}>•</span>
                      <span>{moment(post.createdAt).format('DD/MM/YYYY')}</span>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <Pagination
          current={page}
          pageSize={9}
          total={blogPost.total}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default connect(
  ({ blogPost, blogTag }: { blogPost: PostModelState; blogTag: TagModelState }) => ({
    blogPost,
    blogTag,
  }),
)(TrangChu);

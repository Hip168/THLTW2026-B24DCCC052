import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Row, Tag as AntTag, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import type { PostModelState } from '@/models/blog/post';
import type { TagModelState } from '@/models/blog/tag';
import type { Post, Tag } from '@/types/blog';

const { Title, Text, Paragraph } = Typography;

interface ChiTietProps {
  blogPost: PostModelState;
  blogTag: TagModelState;
  dispatch: (action: { type: string; payload?: Record<string, unknown> }) => void;
  match: { params: { slug: string } };
  history: { goBack: () => void; push: (path: string) => void };
}

const ChiTiet: React.FC<ChiTietProps> = ({ blogPost, blogTag, dispatch, match, history }) => {
  const { slug } = match.params;
  const { detail, list } = blogPost;

  useEffect(() => {
    dispatch({ type: 'blogPost/fetchDetail', payload: { slug } });
    dispatch({ type: 'blogTag/fetchList' });
    dispatch({ type: 'blogPost/fetchList', payload: {} });
  }, [slug, dispatch]);

  useEffect(() => {
    if (detail && detail.slug === slug) {
      dispatch({ type: 'blogPost/incrementView', payload: { id: detail.id } });
    }
  }, [detail?.id]);

  const getTagName = (tagId: string) => {
    const found = blogTag.list.find((t: Tag) => t.id === tagId);
    return found ? found.name : tagId;
  };

  const relatedPosts = list.filter((p: Post) => {
    if (!detail) return false;
    if (p.slug === slug) return false;
    return p.tags.some((t) => detail.tags.includes(t));
  }).slice(0, 3);

  if (!detail) return null;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 24 }} onClick={() => history.goBack()}>
        Quay lại
      </Button>

      <img
        src={detail.thumbnail}
        alt={detail.title}
        style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 8, marginBottom: 24 }}
      />

      <Title level={2}>{detail.title}</Title>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Text type="secondary">{detail.author}</Text>
        <Text type="secondary">•</Text>
        <Text type="secondary">{moment(detail.createdAt).format('DD/MM/YYYY')}</Text>
        <Text type="secondary">•</Text>
        <Text type="secondary"><EyeOutlined /> {detail.viewCount} lượt xem</Text>
        <div>
          {detail.tags.map((tagId) => (
            <AntTag key={tagId} color="red">{getTagName(tagId)}</AntTag>
          ))}
        </div>
      </div>

      <Divider />

      <div
        style={{ lineHeight: 1.8, fontSize: 15 }}
        dangerouslySetInnerHTML={{ __html: detail.content.replace(/\n/g, '<br/>').replace(/## (.*)/g, '<h2>$1</h2>') }}
      />

      {relatedPosts.length > 0 && (
        <>
          <Divider />
          <Title level={4}>Bài viết liên quan</Title>
          <Row gutter={[16, 16]}>
            {relatedPosts.map((post: Post) => (
              <Col key={post.id} span={8}>
                <Card
                  hoverable
                  size="small"
                  cover={
                    <img
                      alt={post.title}
                      src={post.thumbnail}
                      style={{ height: 120, objectFit: 'cover' }}
                    />
                  }
                  onClick={() => history.push(`/blog/${post.slug}`)}
                >
                  <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 4, fontWeight: 600 }}>
                    {post.title}
                  </Paragraph>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {moment(post.createdAt).format('DD/MM/YYYY')}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default connect(
  ({ blogPost, blogTag }: { blogPost: PostModelState; blogTag: TagModelState }) => ({
    blogPost,
    blogTag,
  }),
)(ChiTiet);

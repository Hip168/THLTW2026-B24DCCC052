import { FacebookOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Row, Tag as AntTag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import type { Author } from '@/types/blog';

const { Title, Paragraph, Text } = Typography;

const GioiThieu: React.FC = () => {
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    axios.get('/api/blog/author').then((res) => {
      setAuthor(res.data.data);
    });
  }, []);

  if (!author) return null;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <Row gutter={32} align="middle">
          <Col span={10} style={{ textAlign: 'center' }}>
            <Avatar size={128} src={author.avatar} style={{ marginBottom: 16 }} />
            <Title level={3} style={{ marginBottom: 4 }}>
              {author.name}
            </Title>
            <Paragraph style={{ color: '#666' }}>{author.bio}</Paragraph>
          </Col>

          <Col span={14}>
            <Divider orientation="left">Kỹ năng</Divider>
            <div style={{ marginBottom: 24 }}>
              {author.skills.map((skill) => (
                <AntTag key={skill} color="#CC0D00" style={{ marginBottom: 8 }}>
                  {skill}
                </AntTag>
              ))}
            </div>

            <Divider orientation="left">Liên kết</Divider>
            <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
              {author.social.github && (
                <a href={author.social.github} target="_blank" rel="noreferrer">
                  <GithubOutlined style={{ marginRight: 8, fontSize: 18 }} />
                  <Text>GitHub</Text>
                </a>
              )}
              {author.social.linkedin && (
                <a href={author.social.linkedin} target="_blank" rel="noreferrer">
                  <LinkedinOutlined style={{ marginRight: 8, fontSize: 18, color: '#0077b5' }} />
                  <Text>LinkedIn</Text>
                </a>
              )}
              {author.social.facebook && (
                <a href={author.social.facebook} target="_blank" rel="noreferrer">
                  <FacebookOutlined style={{ marginRight: 8, fontSize: 18, color: '#1877f2' }} />
                  <Text>Facebook</Text>
                </a>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default GioiThieu;

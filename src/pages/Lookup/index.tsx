import { traCuuVanBang } from '@/services/traCuu';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Space, Descriptions, Divider } from 'antd';
import moment from 'moment';
import { useState } from 'react';

const LookupPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onSearch = async (values: any) => {
    const params = {
      ...values,
      ngaySinh: values.ngaySinh ? values.ngaySinh.toISOString() : undefined,
    };

    const filledParams = Object.values(params).filter(p => !!p);
    if (filledParams.length < 2) {
      message.error('Vui lòng nhập ít nhất 2 thông tin để tra cứu');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await traCuuVanBang(params);
      if (res.data?.success && res.data?.data) {
        setResult(res.data.data);
      } else {
        message.warning(res.data?.message || 'Không tìm thấy thông tin văn bằng');
      }
    } catch (er) {
      console.log(er);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title="Tra cứu thông tin văn bằng" bordered={false}>
        <Form form={form} onFinish={onSearch} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="soHieu" label="Số hiệu văn bằng">
                <Input placeholder="Nhập số hiệu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="soVaoSo" label="Số vào sổ">
                <Input placeholder="Nhập số vào sổ" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maSinhVien" label="Mã sinh viên">
                <Input placeholder="Nhập mã sinh viên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hoTen" label="Họ tên">
                <Input placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="ngaySinh" label="Ngày sinh">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tra cứu
              </Button>
              <Button onClick={() => { form.resetFields(); setResult(null); }}>
                Làm mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {result && (
        <Card style={{ marginTop: '20px' }} title="Kết quả tra cứu" bordered={false}>
          <Descriptions title="Thông tin văn bằng" bordered column={1}>
            <Descriptions.Item label="Số hiệu">{result.soHieu}</Descriptions.Item>
            <Descriptions.Item label="Số vào sổ">{result.soVaoSo}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{result.hoTen}</Descriptions.Item>
            <Descriptions.Item label="Mã sinh viên">{result.maSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{moment(result.ngaySinh).format('DD/MM/YYYY')}</Descriptions.Item>
            
            {result.duLieuDong && Object.entries(result.duLieuDong).map(([key, val]: [string, any]) => (
              <Descriptions.Item key={key} label={key}>
                {moment.isMoment(val) || (typeof val === 'string' && val.includes('T') && !isNaN(Date.parse(val))) 
                  ? moment(val).format('DD/MM/YYYY') 
                  : val}
              </Descriptions.Item>
            ))}
          </Descriptions>

          {result.decision && (
            <>
              <Divider />
              <Descriptions title="Thông tin quyết định tốt nghiệp" bordered column={1}>
                <Descriptions.Item label="Số quyết định">{result.decision.soQuyetDinh}</Descriptions.Item>
                <Descriptions.Item label="Ngày ban hành">{moment(result.decision.ngayBanHanh).format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Trích yếu">{result.decision.trichYeu}</Descriptions.Item>
              </Descriptions>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default LookupPage;

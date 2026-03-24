import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormTemplateConfig = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
    useModel('diploma.cauhinhbieumau');
  const title = props?.title ?? '';

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?._id) form.setFieldsValue(record);
  }, [record?._id, visibleForm]);

  const onFinish = async (values: Diploma.ICauHinhBieuMau) => {
    if (edit) {
      putModel(record?._id ?? '', values)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          name="tenTruong"
          label="Tên trường thông tin"
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
        >
          <Input placeholder="Tên trường (ví dụ: Ngành đào tạo)" />
        </Form.Item>

        <Form.Item
          name="kieuDuLieu"
          label="Kiểu dữ liệu"
          rules={[...rules.required]}
        >
          <Select placeholder="Chọn kiểu dữ liệu">
            <Select.Option value="String">String</Select.Option>
            <Select.Option value="Number">Number</Select.Option>
            <Select.Option value="Date">Date</Select.Option>
          </Select>
        </Form.Item>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormTemplateConfig;

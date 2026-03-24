import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormGraduationDecision = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
    useModel('diploma.quyetdinh');
  const { danhSach: danhSachSo, getAllModel: getAllSo } = useModel('diploma.sovanbang');
  
  const title = props?.title ?? '';

  useEffect(() => {
    getAllSo();
  }, []);

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?._id) {
      form.setFieldsValue({
        ...record,
        ngayBanHanh: record.ngayBanHanh ? moment(record.ngayBanHanh) : undefined,
      });
    }
  }, [record?._id, visibleForm]);

  const onFinish = async (values: any) => {
    const payload = {
      ...values,
      ngayBanHanh: values.ngayBanHanh ? values.ngayBanHanh.toISOString() : undefined,
    };
    if (edit) {
      putModel(record?._id ?? '', payload)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(payload)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          name="soQuyetDinh"
          label="Số quyết định"
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
        >
          <Input placeholder="Số quyết định" />
        </Form.Item>

        <Form.Item
          name="ngayBanHanh"
          label="Ngày ban hành"
          rules={[...rules.required]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
        </Form.Item>

        <Form.Item
          name="trichYeu"
          label="Trích yếu"
          rules={[...rules.text, ...rules.length(500)]}
        >
          <Input.TextArea rows={2} placeholder="Trích yếu" />
        </Form.Item>

        <Form.Item
          name="idSoVanBang"
          label="Sổ văn bằng"
          rules={[...rules.required]}
        >
          <Select placeholder="Chọn sổ văn bằng">
            {danhSachSo.map(item => (
              <Select.Option key={item._id} value={item._id}>{item.ten}</Select.Option>
            ))}
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

export default FormGraduationDecision;

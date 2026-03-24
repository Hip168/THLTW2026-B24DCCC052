import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDiplomaInfo = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
    useModel('diploma.thongtinvanbang');
  const { danhSach: danhSachQuyetDinh, getAllModel: getAllQD } = useModel('diploma.quyetdinh');
  const { danhSach: templates, getAllModel: getAllTemplates } = useModel('diploma.cauhinhbieumau');
  
  const title = props?.title ?? '';

  useEffect(() => {
    getAllQD();
    getAllTemplates();
  }, []);

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?._id) {
      const initialValues: any = {
        ...record,
        ngaySinh: record.ngaySinh ? moment(record.ngaySinh) : undefined,
      };
      
      // Process dynamic fields for moment validation
      if (record.duLieuDong) {
        templates.forEach(t => {
          if (t.kieuDuLieu === 'Date' && record.duLieuDong[t.tenTruong]) {
            initialValues[`dynamic_${t.tenTruong}`] = moment(record.duLieuDong[t.tenTruong]);
          } else {
            initialValues[`dynamic_${t.tenTruong}`] = record.duLieuDong[t.tenTruong];
          }
        });
      }
      form.setFieldsValue(initialValues);
    }
  }, [record?._id, visibleForm, templates.length]);

  const onFinish = async (values: any) => {
    const duLieuDong: Record<string, any> = {};
    templates.forEach(t => {
      let val = values[`dynamic_${t.tenTruong}`];
      if (t.kieuDuLieu === 'Date' && val) {
        val = val.toISOString();
      }
      duLieuDong[t.tenTruong] = val;
    });

    const payload = {
      ...values,
      ngaySinh: values.ngaySinh ? values.ngaySinh.toISOString() : undefined,
      duLieuDong,
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
        <Form.Item name="soVaoSo" label="Số vào sổ">
          <Input disabled placeholder="Tự động sinh khi lưu" />
        </Form.Item>

        <Form.Item name="soHieu" label="Số hiệu văn bằng" rules={[...rules.required]}>
          <Input placeholder="Số hiệu văn bằng" />
        </Form.Item>

        <Form.Item name="maSinhVien" label="Mã sinh viên" rules={[...rules.required]}>
          <Input placeholder="Mã sinh viên" />
        </Form.Item>

        <Form.Item name="hoTen" label="Họ tên" rules={[...rules.required]}>
          <Input placeholder="Họ tên" />
        </Form.Item>

        <Form.Item name="ngaySinh" label="Ngày sinh" rules={[...rules.required]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
        </Form.Item>

        <Form.Item name="idQuyetDinh" label="Quyết định tốt nghiệp" rules={[...rules.required]}>
          <Select placeholder="Chọn quyết định">
            {danhSachQuyetDinh.map(item => (
              <Select.Option key={item._id} value={item._id}>{item.soQuyetDinh}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        {templates.map(t => (
          <Form.Item
            key={t._id}
            name={`dynamic_${t.tenTruong}`}
            label={t.tenTruong}
          >
            {t.kieuDuLieu === 'String' && <Input placeholder={`Nhập ${t.tenTruong.toLowerCase()}`} />}
            {t.kieuDuLieu === 'Number' && <InputNumber style={{ width: '100%' }} placeholder={`Nhập ${t.tenTruong.toLowerCase()}`} />}
            {t.kieuDuLieu === 'Date' && <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder={`Chọn ${t.tenTruong.toLowerCase()}`} />}
          </Form.Item>
        ))}

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

export default FormDiplomaInfo;

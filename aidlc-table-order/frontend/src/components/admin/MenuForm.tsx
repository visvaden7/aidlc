import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch } from 'antd';
import type { Menu, Category } from '@/types';

interface MenuFormProps {
  open: boolean;
  menu: Menu | null;
  categories: Category[];
  onSubmit: (values: MenuFormValues) => void;
  onCancel: () => void;
}

export interface MenuFormValues {
  menuName: string;
  price: number;
  description: string;
  categoryId: number;
  imageUrl: string;
  isAvailable: boolean;
}

export default function MenuForm({
  open,
  menu,
  categories,
  onSubmit,
  onCancel,
}: MenuFormProps) {
  const [form] = Form.useForm<MenuFormValues>();

  useEffect(() => {
    if (open) {
      if (menu) {
        form.setFieldsValue({
          menuName: menu.menuName,
          price: menu.price,
          description: menu.description || '',
          categoryId: menu.categoryId,
          imageUrl: menu.imageUrl || '',
          isAvailable: menu.isAvailable,
        });
      } else {
        form.resetFields();
        form.setFieldValue('isAvailable', true);
      }
    }
  }, [open, menu, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      // validation errors shown inline
    }
  };

  return (
    <Modal
      open={open}
      title={menu ? '메뉴 수정' : '메뉴 추가'}
      onOk={handleOk}
      onCancel={onCancel}
      okText="저장"
      cancelText="취소"
      data-testid="menu-form-modal"
      destroyOnClose
    >
      <Form form={form} layout="vertical" data-testid="menu-form">
        <Form.Item
          name="menuName"
          label="메뉴명"
          rules={[
            { required: true, message: '메뉴명을 입력해주세요' },
            { max: 100, message: '100자 이내로 입력해주세요' },
          ]}
        >
          <Input placeholder="메뉴명" data-testid="menu-form-name" />
        </Form.Item>

        <Form.Item
          name="price"
          label="가격 (원)"
          rules={[
            { required: true, message: '가격을 입력해주세요' },
            { type: 'number', min: 0, max: 1000000, message: '0~1,000,000 범위로 입력해주세요' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="가격"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            data-testid="menu-form-price"
          />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="카테고리"
          rules={[{ required: true, message: '카테고리를 선택해주세요' }]}
        >
          <Select placeholder="카테고리 선택" data-testid="menu-form-category">
            {categories.map((c) => (
              <Select.Option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="설명"
          rules={[{ max: 500, message: '500자 이내로 입력해주세요' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="메뉴 설명 (선택)"
            data-testid="menu-form-description"
          />
        </Form.Item>

        <Form.Item name="imageUrl" label="이미지 URL">
          <Input
            placeholder="https://example.com/image.jpg (선택)"
            data-testid="menu-form-image-url"
          />
        </Form.Item>

        <Form.Item name="isAvailable" label="판매 상태" valuePropName="checked">
          <Switch
            checkedChildren="판매중"
            unCheckedChildren="품절"
            data-testid="menu-form-available"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

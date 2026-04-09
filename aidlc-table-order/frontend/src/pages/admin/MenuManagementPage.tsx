import { useEffect, useState, useCallback } from 'react';
import { Typography, Button, Table, Space, Image, Switch, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuthStore } from '@/stores/authStore';
import { menuApi } from '@/services/menuApi';
import { adminMenuApi } from '@/services/adminMenuApi';
import AdminLayout from '@/components/admin/AdminLayout';
import CategoryTabs from '@/components/customer/CategoryTabs';
import MenuForm, { type MenuFormValues } from '@/components/admin/MenuForm';
import Loading from '@/components/common/Loading';
import type { Menu, Category } from '@/types';

const { Title } = Typography;

interface SortableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

function SortableRow(props: SortableRowProps) {
  const id = props['data-row-key'];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  };

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
}

export default function MenuManagementPage() {
  const storeId = useAuthStore((s) => s.storeId);

  const [categories, setCategories] = useState<Category[]>([]);
  const [allMenus, setAllMenus] = useState<Menu[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const loadData = useCallback(async () => {
    if (!storeId) return;
    setIsLoading(true);
    try {
      const [catRes, menuRes] = await Promise.all([
        menuApi.getCategories(storeId),
        menuApi.getMenus(storeId),
      ]);
      setCategories(catRes.data);
      setAllMenus(menuRes.data);
      if (catRes.data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(catRes.data[0].categoryId);
      }
    } catch {
      // handled by interceptor
    } finally {
      setIsLoading(false);
    }
  }, [storeId, selectedCategoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredMenus = selectedCategoryId
    ? allMenus.filter((m) => m.categoryId === selectedCategoryId)
    : allMenus;

  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';

  const handleFormSubmit = async (values: MenuFormValues) => {
    try {
      if (editingMenu) {
        await adminMenuApi.updateMenu(editingMenu.menuId, values);
        notification.success({ message: '메뉴가 수정되었습니다', duration: 2 });
      } else {
        await adminMenuApi.createMenu(storeId!, values);
        notification.success({ message: '메뉴가 등록되었습니다', duration: 2 });
      }
      setIsFormOpen(false);
      setEditingMenu(null);
      loadData();
    } catch {
      // handled by interceptor
    }
  };

  const handleDelete = async (menuId: number) => {
    try {
      await adminMenuApi.deleteMenu(menuId);
      notification.success({ message: '메뉴가 삭제되었습니다', duration: 2 });
      loadData();
    } catch {
      // handled by interceptor
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredMenus.findIndex((m) => String(m.menuId) === String(active.id));
    const newIndex = filteredMenus.findIndex((m) => String(m.menuId) === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(filteredMenus, oldIndex, newIndex);
    const updatedAll = allMenus.map((m) => {
      const idx = reordered.findIndex((r) => r.menuId === m.menuId);
      return idx !== -1 ? { ...m, displayOrder: idx } : m;
    });
    setAllMenus(updatedAll);

    try {
      await adminMenuApi.reorderMenus(
        reordered.map((m, idx) => ({ menuId: m.menuId, displayOrder: idx })),
      );
    } catch {
      loadData();
    }
  };

  const columns = [
    {
      title: '',
      width: 40,
      render: () => <HolderOutlined style={{ cursor: 'grab', color: '#999' }} />,
    },
    {
      title: '이미지',
      dataIndex: 'imageUrl',
      width: 80,
      render: (url: string) => (
        <Image
          src={url || undefined}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='60' height='60' fill='%23f0f0f0'/></svg>"
        />
      ),
    },
    { title: '메뉴명', dataIndex: 'menuName' },
    {
      title: '가격',
      dataIndex: 'price',
      width: 120,
      render: (price: number) => formatPrice(price),
    },
    {
      title: '상태',
      dataIndex: 'isAvailable',
      width: 80,
      render: (isAvailable: boolean) => (
        <Switch size="small" checked={isAvailable} disabled checkedChildren="판매" unCheckedChildren="품절" />
      ),
    },
    {
      title: '액션',
      width: 120,
      render: (_: unknown, record: Menu) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setEditingMenu(record);
              setIsFormOpen(true);
            }}
            data-testid={`menu-edit-${record.menuId}`}
          />
          <Popconfirm
            title="이 메뉴를 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.menuId)}
            okText="삭제"
            cancelText="취소"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
              data-testid={`menu-delete-${record.menuId}`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div data-testid="menu-management-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>메뉴 관리</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingMenu(null);
              setIsFormOpen(true);
            }}
            data-testid="menu-add-button"
          >
            메뉴 추가
          </Button>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <CategoryTabs
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={filteredMenus.map((m) => String(m.menuId))}
                strategy={verticalListSortingStrategy}
              >
                <Table
                  dataSource={filteredMenus}
                  columns={columns}
                  rowKey={(record) => String(record.menuId)}
                  pagination={false}
                  components={{ body: { row: SortableRow } }}
                  style={{ marginTop: 16 }}
                />
              </SortableContext>
            </DndContext>
          </>
        )}

        <MenuForm
          open={isFormOpen}
          menu={editingMenu}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingMenu(null);
          }}
        />
      </div>
    </AdminLayout>
  );
}

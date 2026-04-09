-- Seed Data for Table Order Service
-- Password: admin1234 -> bcrypt hash
-- Table Password: 1234 -> bcrypt hash

-- Store
INSERT IGNORE INTO store (store_id, store_name, store_code, created_at)
VALUES (1, '맛있는 식당', 'STORE001', NOW());

-- Admin User (password: admin1234)
INSERT IGNORE INTO admin_user (admin_user_id, store_id, username, password_hash, login_attempts, created_at)
VALUES (1, 1, 'admin', '$2a$10$xf8ejaubFzhVpOmqbxBRs.QjD5FUoM59mP0Ts/HMFugKeF78BBOHm', 0, NOW());

-- Categories
INSERT IGNORE INTO category (category_id, store_id, category_name, display_order, created_at)
VALUES (1, 1, '메인메뉴', 1, NOW()),
       (2, 1, '사이드메뉴', 2, NOW()),
       (3, 1, '음료', 3, NOW()),
       (4, 1, '디저트', 4, NOW());

-- Menus - 메인메뉴
INSERT IGNORE INTO menu (menu_id, category_id, store_id, menu_name, price, description, image_url, display_order, is_available, created_at, updated_at)
VALUES (1, 1, 1, '김치찌개', 9000, '깊은 맛의 전통 김치찌개', 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400', 1, true, NOW(), NOW()),
       (2, 1, 1, '된장찌개', 8500, '구수한 된장찌개', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', 2, true, NOW(), NOW()),
       (3, 1, 1, '불고기', 13000, '달콤한 양념 불고기', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', 3, true, NOW(), NOW()),
       (4, 1, 1, '비빔밥', 10000, '신선한 야채 비빔밥', 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400', 4, true, NOW(), NOW());

-- Menus - 사이드메뉴
INSERT IGNORE INTO menu (menu_id, category_id, store_id, menu_name, price, description, image_url, display_order, is_available, created_at, updated_at)
VALUES (5, 2, 1, '계란말이', 5000, '부드러운 계란말이', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', 1, true, NOW(), NOW()),
       (6, 2, 1, '감자전', 6000, '바삭한 감자전', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', 2, true, NOW(), NOW()),
       (7, 2, 1, '김치전', 7000, '매콤한 김치전', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', 3, true, NOW(), NOW());

-- Menus - 음료
INSERT IGNORE INTO menu (menu_id, category_id, store_id, menu_name, price, description, image_url, display_order, is_available, created_at, updated_at)
VALUES (8, 3, 1, '콜라', 2000, '시원한 콜라', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', 1, true, NOW(), NOW()),
       (9, 3, 1, '사이다', 2000, '청량한 사이다', 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400', 2, true, NOW(), NOW()),
       (10, 3, 1, '맥주', 5000, '시원한 생맥주', 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400', 3, true, NOW(), NOW()),
       (11, 3, 1, '소주', 5000, '참이슬 소주', 'https://images.unsplash.com/photo-1574006852631-83fd3dc16cc3?w=400', 4, true, NOW(), NOW());

-- Menus - 디저트
INSERT IGNORE INTO menu (menu_id, category_id, store_id, menu_name, price, description, image_url, display_order, is_available, created_at, updated_at)
VALUES (12, 4, 1, '아이스크림', 3000, '바닐라 아이스크림', 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', 1, true, NOW(), NOW()),
       (13, 4, 1, '식혜', 3000, '시원한 전통 식혜', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400', 2, true, NOW(), NOW());

-- Tables (password: 1234)
INSERT IGNORE INTO table_info (table_id, store_id, table_number, table_password, created_at)
VALUES (1, 1, 1, '$2a$10$AQjijRSL3X5HMuGu8Z9m1Oaie/A/h0cuqiAEGOX1CN2z1FC06YOzq', NOW()),
       (2, 1, 2, '$2a$10$AQjijRSL3X5HMuGu8Z9m1Oaie/A/h0cuqiAEGOX1CN2z1FC06YOzq', NOW()),
       (3, 1, 3, '$2a$10$AQjijRSL3X5HMuGu8Z9m1Oaie/A/h0cuqiAEGOX1CN2z1FC06YOzq', NOW()),
       (4, 1, 4, '$2a$10$AQjijRSL3X5HMuGu8Z9m1Oaie/A/h0cuqiAEGOX1CN2z1FC06YOzq', NOW()),
       (5, 1, 5, '$2a$10$AQjijRSL3X5HMuGu8Z9m1Oaie/A/h0cuqiAEGOX1CN2z1FC06YOzq', NOW());

-- ============================================================
-- THIMPSON EXPRESS - Relational Database Schema (PostgreSQL)
-- Version: 1.0.0
-- Designed for scalability, AI automation, real-time tracking,
-- multi-platform (web + mobile) reporting
-- ============================================================

-- ===== 1. USERS & AUTHENTICATION =====

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'driver', 'client');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_oossp.uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== 2. CLIENT PROFILES =====

CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cedula VARCHAR(20),
    birth_date DATE,
    preferred_contact VARCHAR(10) DEFAULT 'whatsapp',
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE client_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    alias VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    reference TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== 3. DRIVERS (MOTORIZADOS / PILOTOS) =====

CREATE TYPE driver_status AS ENUM ('offline', 'available', 'busy', 'paused');
CREATE TYPE vehicle_type AS ENUM ('motorcycle', 'car', 'bicycle', 'truck');

CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status driver_status DEFAULT 'offline',
    vehicle_type vehicle_type DEFAULT 'motorcycle',
    vehicle_plate VARCHAR(20),
    vehicle_brand VARCHAR(50),
    vehicle_model VARCHAR(50),
    vehicle_color VARCHAR(30),
    license_number VARCHAR(50),
    is_verified BOOLEAN DEFAULT false,
    rating DECIMAL(2,1) DEFAULT 5.0,
    total_trips INT DEFAULT 0,
    total_earned DECIMAL(12,2) DEFAULT 0,
    commission_rate DECIMAL(3,2) DEFAULT 0.15,
    max_concurrent_orders INT DEFAULT 1,
    current_zone VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE driver_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    heading DECIMAL(5,2),
    speed DECIMAL(5,2),
    accuracy DECIMAL(5,2),
    battery_level INT,
    is_moving BOOLEAN DEFAULT false,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX idx_driver_locations_recorded_at ON driver_locations(recorded_at DESC);

CREATE TABLE driver_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    total_orders INT DEFAULT 0,
    total_earned DECIMAL(12,2) DEFAULT 0,
    distance_covered_km DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== 4. SERVICES CONFIGURATION =====

CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    base_fee DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    value VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0
);

-- ===== 5. ORDERS (CORE) =====

CREATE TYPE order_status AS ENUM (
    'pending', 'accepted', 'assigned', 'going_to_origin',
    'at_origin', 'going_to_destination', 'at_destination',
    'completed', 'cancelled', 'expired'
);
CREATE TYPE urgency_level AS ENUM ('normal', 'urgent');
CREATE TYPE zone_type AS ENUM ('urbana', 'periferica');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES client_profiles(id),
    driver_id UUID REFERENCES drivers(id),
    service_category_id UUID NOT NULL REFERENCES service_categories(id),
    service_type VARCHAR(50) NOT NULL,
    status order_status DEFAULT 'pending',
    urgency urgency_level DEFAULT 'normal',
    zone zone_type DEFAULT 'urbana',

    -- Origin
    origin_address TEXT NOT NULL,
    origin_reference TEXT,
    origin_latitude DECIMAL(10,7),
    origin_longitude DECIMAL(10,7),

    -- Destination
    destination_address TEXT NOT NULL,
    destination_reference TEXT,
    destination_latitude DECIMAL(10,7),
    destination_longitude DECIMAL(10,7),

    -- Multi-stop
    has_multi_stop BOOLEAN DEFAULT false,
    has_round_trip BOOLEAN DEFAULT false,

    -- Financial
    base_fee DECIMAL(10,2) NOT NULL,
    num_legs INT DEFAULT 1,
    total_legs_fee DECIMAL(10,2) NOT NULL,
    product_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'C$',
    payment_method VARCHAR(20) DEFAULT 'cash',

    -- Timing
    estimated_minutes INT,
    actual_minutes INT,
    time_limit_minutes INT,
    is_overtime BOOLEAN DEFAULT false,
    accepted_at TIMESTAMP,
    assigned_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancel_reason TEXT,

    -- Metadata
    source VARCHAR(20) DEFAULT 'web',
    assigned_by VARCHAR(50) DEFAULT 'system',
    notes TEXT,
    rating INT,
    review TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_driver_id ON orders(driver_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_date_range ON orders(created_at);

CREATE TABLE order_legs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    leg_number INT NOT NULL,
    origin_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    origin_latitude DECIMAL(10,7),
    origin_longitude DECIMAL(10,7),
    destination_latitude DECIMAL(10,7),
    destination_longitude DECIMAL(10,7),
    distance_km DECIMAL(6,2),
    estimated_minutes INT,
    status order_status DEFAULT 'pending',
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    previous_status order_status,
    new_status order_status NOT NULL,
    changed_by UUID REFERENCES users(id),
    change_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_order_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_history_created_at ON order_status_history(created_at DESC);

-- ===== 6. AI AUTOMATION AGENT =====

CREATE TABLE ai_agent_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) UNIQUE NOT NULL,
    client_phone VARCHAR(20),
    client_name VARCHAR(150),
    platform VARCHAR(20) DEFAULT 'whatsapp',
    is_active BOOLEAN DEFAULT true,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);

CREATE TABLE ai_agent_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_agent_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('client', 'agent', 'system')),
    message_type VARCHAR(30) DEFAULT 'text',
    content TEXT NOT NULL,
    intent VARCHAR(100),
    confidence DECIMAL(3,2),
    response_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ai_messages_session_id ON ai_agent_messages(session_id);
CREATE INDEX idx_ai_messages_created_at ON ai_agent_messages(created_at DESC);

CREATE TABLE ai_agent_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES ai_agent_messages(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    action_data JSONB,
    order_id UUID REFERENCES orders(id),
    was_successful BOOLEAN,
    error_message TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_agent_feedback_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    feedback_type VARCHAR(30) NOT NULL,
    trigger_reason TEXT,
    message_sent TEXT,
    channel VARCHAR(20) DEFAULT 'whatsapp',
    was_delivered BOOLEAN DEFAULT true,
    delivered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== 7. REAL-TIME TELEMETRY & MONITORING =====

CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_system_metrics_name ON system_metrics(metric_name, recorded_at DESC);

CREATE TABLE agent_performance_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    input_tokens INT DEFAULT 0,
    output_tokens INT DEFAULT 0,
    response_time_ms INT,
    was_error BOOLEAN DEFAULT false,
    error_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== 8. NOTIFICATIONS & PUSH TOKENS =====

CREATE TABLE notification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    platform VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    body TEXT,
    type VARCHAR(50) DEFAULT 'info',
    reference_type VARCHAR(50),
    reference_id UUID,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id, is_read, created_at DESC);

-- ===== 9. FINANCE & REPORTS =====

CREATE TABLE driver_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_trips INT NOT NULL,
    total_revenue DECIMAL(12,2) NOT NULL,
    commission_amount DECIMAL(12,2) NOT NULL,
    driver_earnings DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    summary_date DATE UNIQUE NOT NULL,
    total_orders INT DEFAULT 0,
    completed_orders INT DEFAULT 0,
    cancelled_orders INT DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    avg_response_time_min DECIMAL(5,2),
    avg_delivery_time_min DECIMAL(5,2),
    active_drivers INT DEFAULT 0,
    new_clients INT DEFAULT 0,
    agent_interactions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monthly_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INT NOT NULL,
    month INT NOT NULL,
    total_orders INT DEFAULT 0,
    completed_orders INT DEFAULT 0,
    cancelled_orders INT DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    avg_order_value DECIMAL(10,2),
    top_category VARCHAR(100),
    busiest_hour INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, month)
);

-- ===== 10. SYSTEM CONFIGURATION =====

CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- ===== INITIAL SEED DATA =====

INSERT INTO service_categories (slug, name, description, icon, base_fee, sort_order) VALUES
('delivery', 'Delivery Express', 'Llevamos tus pedidos de comida, documentos y más', '🛵', 40, 1),
('encomienda', 'Encomiendas', 'Envía y recibe paquetes de forma segura', '📦', 40, 2),
('mandado', 'Mandados', 'Farmacia, supermercado o tienda. Nosotros lo hacemos por ti', '🛒', 40, 3);

INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'comida', 'Comida / Restaurante', 1 FROM service_categories WHERE slug = 'delivery';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'documentos', 'Documentos', 2 FROM service_categories WHERE slug = 'delivery';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'paquete', 'Paquete pequeño', 3 FROM service_categories WHERE slug = 'delivery';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'medicinas', 'Medicinas / Farmacia', 4 FROM service_categories WHERE slug = 'delivery';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'otro', 'Otro', 5 FROM service_categories WHERE slug = 'delivery';

INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'sobre', 'Sobre / Documentos', 1 FROM service_categories WHERE slug = 'encomienda';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'caja', 'Caja / Paquete', 2 FROM service_categories WHERE slug = 'encomienda';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'electronico', 'Dispositivo electrónico', 3 FROM service_categories WHERE slug = 'encomienda';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'alimento', 'Alimentos', 4 FROM service_categories WHERE slug = 'encomienda';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'otro', 'Otro', 5 FROM service_categories WHERE slug = 'encomienda';

INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'supermercado', 'Supermercado', 1 FROM service_categories WHERE slug = 'mandado';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'farmacia', 'Farmacia', 2 FROM service_categories WHERE slug = 'mandado';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'tienda', 'Tienda / Comercio', 3 FROM service_categories WHERE slug = 'mandado';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'pago', 'Pago de servicios', 4 FROM service_categories WHERE slug = 'mandado';
INSERT INTO service_types (category_id, value, label, sort_order)
SELECT id, 'otro', 'Otro', 5 FROM service_categories WHERE slug = 'mandado';

INSERT INTO system_config (config_key, config_value, description) VALUES
('business_hours', '{"monday":{"open":"08:00","close":"22:00"},"tuesday":{"open":"08:00","close":"22:00"},"wednesday":{"open":"08:00","close":"22:00"},"thursday":{"open":"08:00","close":"22:00"},"friday":{"open":"08:00","close":"22:00"},"saturday":{"open":"08:00","close":"22:00"},"sunday":{"open":"08:00","close":"22:00"}}', 'Horarios de atención del servicio'),
('base_fee', '{"amount":40,"currency":"C$"}', 'Tarifa base por carrera'),
('restricted_areas_after_8pm', '["periferica"]', 'Áreas restringidas después de las 8:00 PM'),
('min_age', '18', 'Edad mínima para solicitar servicio'),
('agent_config', '{"auto_assign":true,"max_distance_km":5,"overtime_minutes":15,"feedback_enabled":true}', 'Configuración del agente IA de automatización');

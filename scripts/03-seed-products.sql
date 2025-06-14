-- Insert MTN data bundles (valid for 3 months)
INSERT INTO products (id, name, provider, price, validity) VALUES
('mtn-1gb', '1GB', 'MTN', 6.00, '3 months'),
('mtn-2gb', '2GB', 'MTN', 12.00, '3 months'),
('mtn-3gb', '3GB', 'MTN', 16.00, '3 months'),
('mtn-4gb', '4GB', 'MTN', 21.00, '3 months'),
('mtn-5gb', '5GB', 'MTN', 27.00, '3 months'),
('mtn-6gb', '6GB', 'MTN', 31.00, '3 months'),
('mtn-7gb', '7GB', 'MTN', 36.00, '3 months'),
('mtn-8gb', '8GB', 'MTN', 40.00, '3 months'),
('mtn-10gb', '10GB', 'MTN', 46.00, '3 months'),
('mtn-15gb', '15GB', 'MTN', 67.00, '3 months'),
('mtn-20gb', '20GB', 'MTN', 84.00, '3 months'),
('mtn-25gb', '25GB', 'MTN', 105.00, '3 months'),
('mtn-30gb', '30GB', 'MTN', 126.00, '3 months'),
('mtn-40gb', '40GB', 'MTN', 163.00, '3 months'),
('mtn-50gb', '50GB', 'MTN', 201.00, '3 months'),
('mtn-100gb', '100GB', 'MTN', 396.00, '3 months')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  provider = EXCLUDED.provider,
  price = EXCLUDED.price,
  validity = EXCLUDED.validity,
  updated_at = NOW();

-- Insert AirtelTigo data bundles (valid for 3 months)
INSERT INTO products (id, name, provider, price, validity) VALUES
('at-1gb', '1GB', 'AirtelTigo', 6.00, '3 months'),
('at-2gb', '2GB', 'AirtelTigo', 10.00, '3 months'),
('at-3gb', '3GB', 'AirtelTigo', 16.00, '3 months'),
('at-4gb', '4GB', 'AirtelTigo', 21.00, '3 months'),
('at-5gb', '5GB', 'AirtelTigo', 25.00, '3 months'),
('at-6gb', '6GB', 'AirtelTigo', 27.00, '3 months'),
('at-7gb', '7GB', 'AirtelTigo', 31.00, '3 months'),
('at-8gb', '8GB', 'AirtelTigo', 36.00, '3 months'),
('at-9gb', '9GB', 'AirtelTigo', 40.00, '3 months'),
('at-10gb', '10GB', 'AirtelTigo', 44.00, '3 months'),
('at-15gb', '15GB', 'AirtelTigo', 57.00, '3 months'),
('at-20gb', '20GB', 'AirtelTigo', 66.00, '3 months'),
('at-25gb', '25GB', 'AirtelTigo', 81.00, '3 months'),
('at-30gb', '30GB', 'AirtelTigo', 91.00, '3 months'),
('at-40gb', '40GB', 'AirtelTigo', 106.00, '3 months'),
('at-50gb', '50GB', 'AirtelTigo', 116.00, '3 months'),
('at-60gb', '60GB', 'AirtelTigo', 126.00, '3 months'),
('at-80gb', '80GB', 'AirtelTigo', 156.00, '3 months'),
('at-100gb', '100GB', 'AirtelTigo', 217.00, '3 months')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  provider = EXCLUDED.provider,
  price = EXCLUDED.price,
  validity = EXCLUDED.validity,
  updated_at = NOW();

-- Insert Telecel data bundles (valid for 3 months)
INSERT INTO products (id, name, provider, price, validity) VALUES
('telecel-5gb', '5GB', 'Telecel', 28.00, '3 months'),
('telecel-10gb', '10GB', 'Telecel', 47.00, '3 months'),
('telecel-15gb', '15GB', 'Telecel', 68.00, '3 months'),
('telecel-20gb', '20GB', 'Telecel', 89.00, '3 months'),
('telecel-25gb', '25GB', 'Telecel', 109.00, '3 months'),
('telecel-30gb', '30GB', 'Telecel', 127.00, '3 months'),
('telecel-40gb', '40GB', 'Telecel', 169.00, '3 months'),
('telecel-50gb', '50GB', 'Telecel', 207.00, '3 months'),
('telecel-100gb', '100GB', 'Telecel', 414.00, '3 months')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  provider = EXCLUDED.provider,
  price = EXCLUDED.price,
  validity = EXCLUDED.validity,
  updated_at = NOW();

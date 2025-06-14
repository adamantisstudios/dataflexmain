-- Insert subscription plans
INSERT INTO subscription_plans (name, duration_months, price) VALUES
('3 Months Plan', 3, 35.00),
('4 Months Plan', 4, 50.00),
('5 Months Plan', 5, 60.00),
('6 Months Plan', 6, 120.00)
ON CONFLICT DO NOTHING;

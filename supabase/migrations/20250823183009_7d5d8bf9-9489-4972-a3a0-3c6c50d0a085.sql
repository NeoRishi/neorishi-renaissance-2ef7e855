-- Fix OTP security settings to have shorter expiry times
-- Update auth configuration for shorter OTP expiry (10 minutes instead of default)
UPDATE auth.config 
SET 
  phone_autoconfirm_timeout = 600, -- 10 minutes in seconds
  email_autoconfirm_timeout = 600  -- 10 minutes in seconds
WHERE TRUE;
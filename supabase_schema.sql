-- Create the licenses table
CREATE TABLE public.licenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cnic TEXT NOT NULL,
    name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    address TEXT NOT NULL,
    height TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    license_no TEXT NOT NULL UNIQUE,
    license_types TEXT[] NOT NULL,
    issue_city TEXT NOT NULL,
    valid_from TEXT NOT NULL,
    valid_to TEXT NOT NULL,
    image_url TEXT,
    signature_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Adding some constraints for data integrity
    CONSTRAINT valid_blood_group CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
    CONSTRAINT valid_cnic_format CHECK (cnic ~* '^\d{5}-\d{7}-\d{1}$')
);

-- Add index for faster lookups
CREATE INDEX idx_licenses_cnic ON public.licenses(cnic);
CREATE INDEX idx_licenses_license_no ON public.licenses(license_no);

-- Add RLS (Row Level Security) to protect the data
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read, but only authenticated users to insert/update
CREATE POLICY "Allow public read access" 
    ON public.licenses FOR SELECT 
    USING (true);

CREATE POLICY "Allow authenticated insert" 
    ON public.licenses FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" 
    ON public.licenses FOR UPDATE 
    TO authenticated 
    USING (true);

-- Create a function to validate dates
CREATE OR REPLACE FUNCTION validate_license_dates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.valid_from > NEW.valid_to THEN
        RAISE EXCEPTION 'Valid from date must be before valid to date';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to validate dates on insert and update
CREATE TRIGGER check_license_dates
BEFORE INSERT OR UPDATE ON public.licenses
FOR EACH ROW EXECUTE FUNCTION validate_license_dates();

-- Create function to search licenses by name, cnic, or license number
CREATE OR REPLACE FUNCTION search_licenses(search_term TEXT)
RETURNS SETOF public.licenses AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.licenses
    WHERE 
        name ILIKE '%' || search_term || '%' OR
        cnic ILIKE '%' || search_term || '%' OR
        license_no ILIKE '%' || search_term || '%';
END;
$$ LANGUAGE plpgsql; 
-- Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    favorite_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    inv_id INT NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE,
    FOREIGN KEY (inv_id) REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
    UNIQUE(account_id, inv_id) -- Prevent duplicate favorites
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    booking_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    inv_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE,
    FOREIGN KEY (inv_id) REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
    CHECK (end_date > start_date),
    CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Add indexes for better performance
CREATE INDEX idx_favorites_account ON public.favorites(account_id);
CREATE INDEX idx_bookings_account ON public.bookings(account_id);
CREATE INDEX idx_bookings_dates ON public.bookings(start_date, end_date);
-- Run this file in the Supabase SQL editor for a fresh project.
-- It creates the app schema, RLS policies, triggers, and a small starter dataset.

create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade not null,
  full_name text,
  email text,
  phone text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create policy "Users can view own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create table public.challans (
  id uuid primary key default gen_random_uuid(),
  challan_number text unique not null,
  vehicle_number text not null,
  owner_name text not null,
  violation_type text not null,
  location text not null,
  challan_date date not null default current_date,
  challan_time time not null default current_time,
  fine_amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'disputed', 'overdue')),
  officer_name text not null,
  officer_badge text not null,
  due_date date not null,
  state text not null default 'Delhi',
  created_by uuid references auth.users(id),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.challans enable row level security;

create policy "Authenticated users can view challans"
  on public.challans for select
  to authenticated
  using (true);

create policy "Public can view challans"
  on public.challans for select
  to anon
  using (true);

create policy "Admins can insert challans"
  on public.challans for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update challans"
  on public.challans for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete challans"
  on public.challans for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);

  insert into public.user_roles (user_id, role)
  values (new.id, 'user');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

create trigger update_challans_updated_at
  before update on public.challans
  for each row execute function public.update_updated_at_column();

insert into public.challans (
  challan_number,
  vehicle_number,
  owner_name,
  violation_type,
  location,
  challan_date,
  challan_time,
  fine_amount,
  status,
  officer_name,
  officer_badge,
  due_date,
  state
) values
  ('DL-2024-00145823', 'DL 01 AB 1234', 'Rajesh Kumar', 'Over Speeding', 'NH-48, Near Toll Plaza, Gurugram', '2024-12-15', '14:30', 2000, 'pending', 'SI Anil Sharma', 'DTP-4521', '2025-01-15', 'Delhi'),
  ('DL-2024-00145824', 'DL 01 AB 1234', 'Rajesh Kumar', 'No Seat Belt', 'Ring Road, ITO Junction, Delhi', '2024-11-20', '09:15', 1000, 'paid', 'ASI Priya Singh', 'DTP-3287', '2024-12-20', 'Delhi'),
  ('MH-2024-00298341', 'MH 02 CD 5678', 'Amit Patel', 'Red Light Violation', 'Western Express Highway, Andheri, Mumbai', '2024-12-10', '18:45', 5000, 'overdue', 'Inspector Suresh Jadhav', 'MTP-1129', '2025-01-10', 'Maharashtra'),
  ('KA-2024-00112233', 'KA 05 EF 9012', 'Sneha Reddy', 'Using Mobile Phone', 'MG Road, Near Brigade Junction, Bengaluru', '2024-12-18', '11:00', 5000, 'pending', 'SI Ramesh Gowda', 'BTP-7845', '2025-01-18', 'Karnataka'),
  ('UP-2024-00334455', 'UP 32 GH 3456', 'Priya Verma', 'No Helmet', 'Lucknow-Kanpur Highway, Unnao', '2024-12-05', '16:20', 1000, 'disputed', 'Constable Vikram Yadav', 'UPP-5563', '2025-01-05', 'Uttar Pradesh'),
  ('TN-2024-00556677', 'TN 09 IJ 7890', 'Karthik Subramanian', 'Drunk Driving', 'Anna Salai, Guindy, Chennai', '2024-12-22', '23:30', 10000, 'pending', 'Inspector Lakshmi Narayanan', 'CTP-2201', '2025-01-22', 'Tamil Nadu');

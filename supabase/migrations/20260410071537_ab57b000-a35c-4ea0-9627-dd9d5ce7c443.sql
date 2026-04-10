
-- Create app_role enum
create type public.app_role as enum ('admin', 'user');

-- Create profiles table
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

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles
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

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Create challans table
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

-- Anyone can view challans (for searching)
create policy "Authenticated users can view challans"
  on public.challans for select
  to authenticated
  using (true);

create policy "Public can view challans"
  on public.challans for select
  to anon
  using (true);

-- Only admins can insert challans
create policy "Admins can insert challans"
  on public.challans for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

-- Only admins can update challans
create policy "Admins can update challans"
  on public.challans for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete challans
create policy "Admins can delete challans"
  on public.challans for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile on signup
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

-- Update timestamp function
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

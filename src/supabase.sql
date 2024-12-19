-- Create tables for registered users

create table users (
  id uuid references auth.users on delete cascade not null primary key,
  created timestamp with time zone,
  updated timestamp with time zone,
  email text,
  stripe_customerId text,
  stripe_subscriptionId text,
  stripe_subscriptionStartDate text,
  stripe_subscriptionStatus text
);

alter table users
  enable row level security;

create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  user_name text,
  company_name text,
  website text
);

alter table profiles
  enable row level security;

create policy "User can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "User can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "User can update own profile" on profiles
  for update using (auth.uid() = id);

-- Creates an entry in "public.users" ("auth.users" not accessible via API)
-- Function listed in Supa > Database > Functions

create function public.createUser()
returns trigger as $$
begin
  insert into public.users (id, email, created, updated)
  values (new.id, new.email, now(), now());
  return new;
end;

-- Trigger for above, called when a user signed up
-- Triggers listed in Supa > Database > Triggers > schema: Auth

$$ language plpgsql security definer;
create trigger on_user_created
  after insert on auth.users
  for each row execute procedure public.createUser();

-- Creates an entry in "public.profiles"
-- Function listed in Supa > Database > Functions

create function public.createProfile()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;

-- Trigger for above, called when a user signed up
-- Trigger listed in Supa > Database > Triggers > schema: Public

$$ language plpgsql security definer;
create trigger on_profile_created
  after insert on auth.users
  for each row execute procedure public.createProfile();


   
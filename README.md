# SvelteKit Boilerplate for SaaS / WebApps

SKT ("SvelteKit Template") is a boilerplate for SaaS or web apps. The project is based on Svelte 5 and uses SvelteKit, Tailwind / DaisyUI, Supabase (Auth and DB) and Stripe. SKT is fully responsive with a mobile first design and supports light and dark mode, see below for screenshots.

The project is divided in two main routes, public and private. The public route is the front facing part, ie. the content people see when they visit your website, example.com. The private route is only accessible to logged-in users and resides at example.com/app. This is where registered users can edit their profile, manage their subscription and access the actual app or SaaS. The boilerplate will only show a placeholder in lieu of the app.

Try it live: [DataDa.sh](https://datada.sh)

## Installation

Clone or download repo and install dependencies:

```bash
npm install
```

## Setup .env

Copy <code>.env.example</code> to <code>.env.local</code>. You will have to provide the following info and keys:

```bash
# Project

PUBLIC_PROJECT = 'Your Projects Name'

# Supabase

PUBLIC_SUPABASE_URL = 'https://YOURPROJECT.supabase.co'
PUBLIC_SUPABASE_ANON_KEY = ''
PRIVATE_SUPABASE_SERVICE_ROLE = ''
PUBLIC_SUPABASE_REDIRECT_URL = 'https://localhost:5173/auth/callback'

# Stripe

PUBLIC_DOMAIN = 'http://localhost:5173'
PUBLIC_STRIPE_CUSTOMER_PORTAL = ''
PUBLIC_STRIPE_API_KEY = ''
PRIVATE_STRIPE_API_KEY = ''
PRIVATE_STRIPE_WHSECRET = ''
```

Stripe's WHSecret key is optional; the webhook is implemented at <code>$src/routes/(admin)/webhooks/stripe/+server.ts</code> but currently unused as we use Stripe's embedded checkout, see below.

## Setup Supabase

Create a project in Supabase and make a note of the project URL and keys; you will need to add both the ANON and the SERVICE ROLE key to <code>.env.local</code>. SKT uses Supabase Auth. Two additional public tables are needed for user management: "Users" and "Profiles". In your project, open the SQL Editor and run <code>supabase.sql</code> to set up the tables and triggers.

Currently supported is signing up per email / password and Google OAuth. Enable both providers in Supabase > Authentication > Providers. In SKT, all relevant code resides in <code>$src/routes/(admin)/auth</code>.

In Supabase > Authentication > URL Configuration, set the Site URL to <code>http://localhost:5173</code> and the Redirect URL to <code>http://localhost:5173/auth/callback</code>.

### Email / Password auth

For email leave everything at defaults (disabling "Confirm email" speeds things up during development). Note that changing the user's email is currently not supported.

### Google OAuth

To setup Google OAuth you can follow Supabase's [walkthrough](https://supabase.com/docs/guides/auth/social-login/auth-google). You can ignore the code samples in the walkthrough, all of this is already built-in. Or follow these steps:

In Authentication > Providers, open the Google dropdown and make a note of the callback URL, you will need it in step #7 below. Client ID and Client secret will be filled in at step #12.

In Google Cloud, setup a project, then navigate to Google Auth Platform and click "Get Started". Then:

1. Provide the app name and support email
2. For audience, select "External"
3. Provide a contact email and agree to TOS
4. In the sidebar, select "Clients" and click "Create Client"
5. For application type, select "Web application" and give it a name
6. In "Authorized JS origins", enter http://localhost (in production also add your real domain to the list)
7. In "Authorized redirect URIs", enter the callback URL. It will be of the form https://YOURPROJECT.supabase.co/auth/v1/callback
8. Click "Create".
9. The client will now be listed. Click it to open the configuration and make a note of the "ClientID" and the "Client secret"
10. In the sidebar, select "Data Access".
11. Click "Add or remove scopes" and select ".../auth/userinfo.email" from the list, then "Save"
12. Finally, back in Supabase enter the Client ID and secret into the Google dropdown.

## Setup Stripe

**Note:** This assumes that you are working in Stripe's test mode.

### Stripe API keys

In your Stripe [dashboard](https://dashboard.stripe.com/test/apikeys), make a note of the API keys. You need to add both the public and the private key to your <code>.env.local</code> file (the keys should begin with "pk_test" and "sk_test"). To have the user manage their subscription, enable the customer portal [here](https://dashboard.stripe.com/test/settings/billing/portal) and add the URL to <code>.env.local</code>.

### Stripe Products

SKT assumes three tiers (named "Free", "Core" and "Pro" in the boilerplate). The "Core" and "Pro" tiers feature monthly or yearly billing. Newly registered users default to the "Free" tier so only the other two have to be setup in Stripe. Create two products with two prices each, one for a monthly payment, one for a yearly payment. Make a note of the respective product IDs ("prod...") and price IDs ("price...").

Modify the table in <code>$lib/utility/plans.ts</code> to represent your products. You will need to provide all details, like so:

```bash
{
    id: 'core',
    name: 'Core',
    description: 'Core plan description.',
    popular: 'true',
    price: ['$9.99', '$99.99'],
    priceIntervalName: ['monthly', 'yearly'],
    priceId: ['price_1QSdXlEIoDgScXMg0KHwWiDH', 'price_1QSdXlEIoDgScXMgrEfsS170'],
    productId: 'prod_RLKCfgua9ZWSiN',
    features: ['Everything in Free', 'Core Feature 1', 'Core Feature 2']
}
```

The data will be pulled from the table and properly formatted. The relevant code lives at <code>$src/(public)/(subscription)/pricing</code> and in <code>$lib/components/PlanCard</code>. Note that the pricing table is dynamic; the button text and destinations change depending on the status of the user. Modify the logic for your use case in PlanCard.svelte, for example if you want to offer upgrades from one tier to a higher one.

### Stripe Webhooks

SKT integrates Stripe's embedded checkout (see <code>$src/routes/(public)/(subscription)/checkout</code>). Once the payment is completed, Stripe's plugin redirects to <code>$src/routes/(public)/(subscription)/subscribed</code>. The code then updates the "Users" table and simply shows a Thank you-note, redirecting the new subscriber to the private section of the site. When a registered user accesses the private section, the code in <code>$src/routes/(private)/app/+layout.server.ts</code> checks with Stripe if the subscription is still active and updates the status accordingly. It's up to you to handle status changes, e.g. to restrict features of your app when a subscription has been deleted or is past due.

In this scenario, webhooks are not required. However, it can be useful to capture additional Stripe subscription events via webhooks. Enable webhooks in the Stripe dashboard and select the events you are interested in. Make a note of the webhook's secret ("whsec...") and add it to <code>.env.local</code>. You will have to provide a publicly accessible URL as a destination. The webhook endpoint sits at <code>$src/routes/(admin)/webhooks/stripe</code>. When live on the web the destination URL would be example.com/webhooks/stripe. In development on localhost, you will need a service like ngrok to make this URL available to the outside.

**Tip:** Use the [Stripe CLI](https://docs.stripe.com/stripe-cli#install) to generate events locally.

## Run

Run the project with:

```bash
npm run dev
```

Then, in your browser, navigate to http://localhost:5173.

## Building & Deployment of the SvelteKit Boilerplate

Before going into production, make sure to change all references to localhost and test data to production values:

1. Change Supabase > Authentication > URL Configuration accordingly
2. Change Stripe PUBLIC_DOMAIN in .env, replace test API keys, webhook secrets and product / price IDs
3. Add domain to "Authorized JS origins" in Google Auth

We assume deploying on a self-hosting platform, e.g. a server on the Hetzner cloud or with Digital Ocean:

### Using PM2

1. Log into your server
2. Make sure you have recent versions of NodeJS, pm2 and nginx (or any other webserver that can act as a reverse proxy)
3. Setup nginx as a reverse proxy for outside access, [tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-22-04), also a sample configuration file is provided in the <code>nginx</code> folder
4. Clone the repo
5. cd into the repo and create a file <code>.env</code> with the keys from <code>.env.local</code>, adjusted for production
6. Run <code>npm run build</code>
7. cd into the <code>build</code> folder and run <code>pm2 start index.js</code>
8. Verify with <code>curl http://localhost:3000</code> that the server is running, check for errors with <code>pm2 log</code>
9. Access your domain via a webbrowser

### Using Docker

**NOTE**: This workflow requires a Docker account, we assume a repo named 'skt'

1. On your development machine, cd into the repo and create a file <code>.env</code> with the keys from <code>.env.local</code>, adjusted for production
2. run <code>npm run build</code>
3. Log into your docker account and build the image with <code>docker build -t $DOCKER_ACCOUNT_NAME/skt:v0.1 .</code> (or any other tag name)
4. Push to the Docker hub with <code>docker push $DOCKER_ACCOUNT_NAME/skt:v0.1</code> or use Docker desktop
5. On Docker.io, verify that the image is listed. **NOTE**: You will want to set the repo to private, as the container contains your Stripe keys and other sensitive data. Consider switching to dynamic environment variables for a public repo, [tutorial](https://khromov.se/dockerizing-your-sveltekit-applications-a-practical-guide/)
6. Log into your server
7. Make sure you have recent versions of Docker and nginx (or any other webserver that can act as a reverse proxy)
8. Setup nginx as a reverse proxy for outside access, [tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-22-04), also a sample configuration file is provided in the <code>nginx</code> folder
9. **TIP:** To avoid having to use sudo for Docker commands, add your user account to the <code>docker</code> group: <code>sudo usermod -aG docker $YOUR_USERNAME</code>
10. Run <code>docker run -p 3000:3000 $DOCKER_ACCOUNT_NAME/skt:v0.1</code>
11. Access your domain via a webbrowser

#### Using Github Actions to build and push the Docker image

A sample workflow is provided in <code>.github/worklows</code>. You will have to provide your docker username and a PAT (personal access token). Note that this workflow builds for arm64 as this is the architecture of the [Datada.sh](https://datada.sh) server. Also, the build action expects an .env file with all data filled in. Only use this action on a private repo or change to dynamic environment variables.

## Credits

### Svelte

[Svelte Dev](https://svelte.dev/)

### Tailwind

[Tailwind CSS](https://tailwindcss.com)

### DaisyUI

[Daisy UI](https://daisyui.com)

### Icons

[HeroIcons](https:/heroicons.com)

### Stripe Integration

Based on [SvelteKit Stripe Demo](https://github.com/kilroyjones/sveltekit-stripe-demo)

## License

MIT.

## Screenshots

[SKT SvelteKit Saas Boilerplate Website](https://softmatic.com/images/skt/screen_01.png)

[SKT SvelteKit Saas Boilerplate Sign In](https://softmatic.com/images/skt/screen_02.png)

[SKT SvelteKit Saas Boilerplate Pricing](https://softmatic.com/images/skt/screen_03.png)

[SKT SvelteKit Saas Boilerplate App](https://softmatic.com/images/skt/screen_04.png)

[SKT SvelteKit Saas Boilerplate Profile](https://softmatic.com/images/skt/screen_06.png)

[SKT SvelteKit Saas Boilerplate Dark Mode](https://softmatic.com/images/skt/screen_05.png)

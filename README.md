# Shopify Countdown Timer App

## Introduction

This Shopify app allows merchants to create, manage, and display countdown timers on their product pages for special promotions and discounts. The app is built using the MERN stack and integrates with Shopify's API to manage authentication, timer creation, and display functionalities.

---

## Features

- Add countdown timers with customizable start/end dates, promotion description, and display options (color, size, position).
- Manage existing timers with the ability to delete timers.
- Display timers on the storefront through a Preact widget integrated via Shopify's Theme App Extension.
- Securely store and retrieve timer data using MongoDB.

---

## Tech Stack

- **Frontend**: React (Admin Interface), Preact (Storefront Widget)
- **Backend**: Node.js with Express
- **Database**: MongoDB (stores timer data for different stores)
- **Shopify Tools**: Shopify API, Shopify AppBridge, Polaris, Theme App Extension

---

## Prerequisites

- Node.js installed.
- MongoDB URI and Shopify API keys (provided in `.env`).
- A Shopify Partner account and a development store.

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. **Set up the environment variables**:  
   Create a `.env` file in the root directory and add the necessary environment variables.

3. **Install dependencies**:

   Using npm:

   ```bash
   npm install
   ```

   Using yarn:

   ```bash
   yarn install
   ```

   Using pnpm:

   ```bash
   pnpm install
   ```

4. **Start the development server**:

   Using npm:

   ```bash
   npm run dev
   ```

   Using yarn:

   ```bash
   yarn dev
   ```

   Using pnpm:

   ```bash
   pnpm run dev
   ```

---

## Local Development

1. Ensure your Shopify app is connected in the Shopify Partners dashboard.
2. Use the Shopify CLI to serve the app and update your development URLs.
3. Once the app is installed in your Shopify store, use the provided local URL to interact with the admin interface.

---

## Managing Timers

1. **Create a Timer**:  
   In the Shopify admin interface, navigate to the countdown timer section. You can set the following:
   - Start Date & Time
   - End Date & Time
   - Promotion Description
   - Display options like color, size, and position

2. **View and Delete Timers**:  
   In the timer management screen, a list of all timers will be displayed. You can delete any timer by clicking the delete button next to the timer.

3. **Display Timer on Product Page**:  
   The Preact widget fetches the timer data and displays the countdown prominently on the store's product pages.

---

## Deployment

To deploy the app, follow these steps:

1. **Build the frontend**:

   Using npm:

   ```bash
   cd web/frontend && npm run build
   ```

   Using yarn:

   ```bash
   cd web/frontend && yarn build
   ```

   Using pnpm:

   ```bash
   cd web/frontend && pnpm run build
   ```

2. **Deploy the app using Shopify CLI**. Refer to the [Shopify documentation](https://shopify.dev/docs/apps/tools/cli/commands) for deployment steps.

---

## Additional Information

- **Database**: The app uses MongoDB to store each store's timer data, ensuring that each store's product page shows the correct timers.
- **Security**: Secure storage of timers using OAuth and MongoDB.
- **Performance**: Ensure that the timers are loaded asynchronously via AJAX to minimize any potential delay in page load times.

---

## License

This project is licensed under the MIT License.

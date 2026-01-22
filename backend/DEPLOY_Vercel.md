# Deploying Perfume Ecommerce Backend to Vercel

Vercel is a great alternative to Render's free tier because it offers a "serverless" model that doesn't sleep in the same way (no 1-minute wake-up time), and it has a generous free tier.

I have already configured your project for Vercel by creating `vercel.json` and `api/index.ts`.

## Steps to Deploy

1.  **Push your changes to GitHub**
    Make sure the new files (`backend/api/index.ts`, `backend/vercel.json`) are committed and pushed.

2.  **Go to Vercel Dashboard**
    - Log in to [vercel.com](https://vercel.com).
    - Click **"Add New..."** -> **"Project"**.
    - Import your `perfume_kart-ecommerce` repository.

3.  **Configure Project**
    - **Framework Preset**: Vercel should auto-detect, or select "Other".
    - **Root Directory**: Click "Edit" and select `backend` folder. **(Crucial Step)**
    - **Environment Variables**: Add the following from your `.env` file:
        - `CONNECTION_URL`
        - `JWT_SECRET`
        - `REFRESH_SECRET`
        - `CLIENT_URL` (Your frontend URL)
        - `SERVER_URL` (Your new Vercel backend URL, e.g., `https://your-project.vercel.app`)
        - `NODE_ENV`: `production`

4.  **Deploy**
    - Click **Deploy**.
    - Vercel will build and assign a domain.

5.  **Update Frontend**
    - Don't forget to update your **Frontend** configuration (likely an `.env` file in the frontend) to point to the new Vercel backend URL instead of the Render URL.

## Alternative: Keep Render Awake (Easiest)
If you prefer to stay on Render but fix the "sleeping" issue, you can use a free uptime monitor.
1.  Go to [cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com).
2.  Create a monitor that hits your Render backend URL (e.g., `https://perfume-backend.onrender.com/health`) every 10 minutes.
3.  This prevents the app from going to sleep.

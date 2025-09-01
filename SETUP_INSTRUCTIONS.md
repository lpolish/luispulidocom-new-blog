# Chess Authentication Setup Instructions

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18 or higher
3. **pnpm**: Package manager (or npm/yarn)

## Step 1: Supabase Setup

### 1.1 Create a New Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New project"
3. Choose your organization
4. Enter project name: `chess-authentication`
5. Create a secure database password
6. Choose a region close to your users
7. Click "Create new project"

### 1.2 Configure Authentication
1. In your Supabase dashboard, go to **Authentication > Settings**
2. Configure the following settings:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production domain when deploying
   - **Email Auth**: Enable email confirmations
   - **Email Templates**: Customize as needed

### 1.3 Set up the Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase/schema.sql`
3. Click "Run" to execute the SQL

### 1.4 Configure Row Level Security (RLS)
The schema.sql file already includes RLS policies, but verify they're active:
1. Go to **Database > Tables**
2. Check that RLS is enabled on:
   - `user_profiles`
   - `chess_scores` 
   - `chess_games`

## Step 2: Environment Variables

### 2.1 Get Supabase Credentials
1. In Supabase dashboard, go to **Settings > API**
2. Copy the following values:
   - **URL**: Your project URL
   - **anon/public key**: For client-side operations
   - **service_role key**: For server-side operations (keep secret!)

### 2.2 Create Environment File
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Step 3: Local Development

### 3.1 Install Dependencies
```bash
pnpm install
```

### 3.2 Run Development Server
```bash
pnpm dev
```

### 3.3 Test Authentication
1. Open [http://localhost:3000/chess](http://localhost:3000/chess)
2. Click "Sign In / Create Account"
3. Create a test account
4. Check your email for verification
5. Verify the account and test score persistence

## Step 4: Testing Checklist

### 4.1 Authentication Flow
- [ ] User registration works
- [ ] Email verification is sent
- [ ] Email verification link works
- [ ] User login works
- [ ] Password reset works
- [ ] User logout works

### 4.2 Chess Score Persistence
- [ ] Anonymous users can play and scores save locally
- [ ] Authenticated users' scores save to database
- [ ] Local scores migrate to database on login
- [ ] Scores persist across browser sessions
- [ ] Score reset works for authenticated users

### 4.3 Security Features
- [ ] Rate limiting prevents spam
- [ ] Input validation works
- [ ] RLS policies prevent unauthorized access
- [ ] API routes require authentication where needed

## Step 5: Production Deployment

### 5.1 Update Supabase Settings
1. In **Authentication > Settings**, update:
   - **Site URL**: Your production domain
   - **Redirect URLs**: Add production URLs

### 5.2 Environment Variables for Production
Set the same environment variables in your deployment platform:
- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Environment Variables
- Railway: Project > Variables

### 5.3 Build and Deploy
```bash
pnpm build
```

Test the production build locally:
```bash
pnpm start
```

## Step 6: Email Configuration (Optional)

### 6.1 Custom SMTP (Recommended for Production)
1. In Supabase dashboard, go to **Authentication > Settings**
2. Scroll to **SMTP Settings**
3. Configure your email provider:
   - **Host**: Your SMTP server
   - **Port**: Usually 587 for TLS
   - **Username**: Your email/API key
   - **Password**: Your email password/API key

### 6.2 Email Templates
Customize email templates in **Authentication > Email Templates**:
- Confirmation email
- Password reset email
- Magic link email (if using)

## Step 7: Monitoring and Analytics

### 7.1 Supabase Analytics
Monitor your application in **Analytics** section:
- API usage
- Database performance
- Authentication events

### 7.2 Error Monitoring
Consider adding error monitoring:
- Sentry
- LogRocket
- Datadog

## Troubleshooting

### Common Issues

1. **"Invalid JWT" errors**
   - Check that SUPABASE_URL and SUPABASE_ANON_KEY are correct
   - Verify the user is properly authenticated

2. **RLS policy errors**
   - Ensure RLS policies are properly set up
   - Check that users are authenticated before making requests

3. **Email not sending**
   - Check SMTP configuration
   - Verify email templates are set up
   - Check spam folder

4. **Rate limiting issues in development**
   - Rate limits use in-memory storage by default
   - Restart the development server to reset limits

### Database Connection Issues

If you can't connect to the database:
1. Check that your Supabase project is active
2. Verify network connectivity
3. Check if your IP is allowlisted (if applicable)

### Performance Optimization

For production:
1. Enable database connection pooling
2. Set up proper indexes (included in schema)
3. Monitor query performance
4. Consider caching strategies

## Security Best Practices

1. **Never expose service role key on client side**
2. **Use HTTPS in production**
3. **Regularly rotate API keys**
4. **Monitor for suspicious activity**
5. **Keep dependencies updated**
6. **Use environment variables for all secrets**

## Next Steps

After successful deployment:
1. Monitor user activity and feedback
2. Consider adding social authentication (Google, GitHub, etc.)
3. Implement user profiles and preferences
4. Add game history and analysis features
5. Consider adding tournaments or multiplayer features

## Support

- **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Project Issues**: Create an issue in the GitHub repository
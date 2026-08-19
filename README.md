# The Dead Good Club

A vintage-magazine single-page site — a long scrolling 1960s-UFO-periodical strip with aged paper, halftone photos, redacted posters, and a mail-in coupon that is a real newsletter form. Built with Next.js 14, TypeScript, and Tailwind CSS.

All homepage copy is editable from the **dgc-pages** Notion database: rows whose Title starts with `home.` override individual text slots (see `NOTION_SETUP.md` §6). **This repo has diverged heavily from the blog template it started as — read `CLAUDE.md` for the actual architecture before making changes.** The template instructions below are kept for historical reference.

## 🚀 Quick Start - Duplicate This Template

Want to create your own blog using this template? Follow these steps:

### 1. Duplicate the Notion Database Template

👉 **[Click here to duplicate the Notion database template](https://cloud24.notion.site/24307b611e30807fba0ce6e074d348ac)**

This will give you the exact database structure needed for this blog template.

### 2. Clone & Setup the Code

```bash
# Clone the repository
git clone <your-repository-url>
cd notion-blog

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### 3. Configure Your Environment

Add your Notion credentials to `.env`:

```env
# Get these from your Notion integration
NOTION_TOKEN=secret_your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here

# Optional: For manual revalidation
REVALIDATION_SECRET=your_secret_key_here
```

### 4. Set Up Notion Integration

1. **Create Integration**: Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. **Create New Integration**: Give it a name like "My Blog"
3. **Copy Token**: This is your `NOTION_TOKEN`
4. **Share Database**: Share your duplicated database with the integration
5. **Get Database ID**: Copy from the database URL

### 5. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog!

## 📋 Database Structure

Your Notion database should have these properties:

| Property           | Type          | Description                        |
| ------------------ | ------------- | ---------------------------------- |
| **Title**          | Title         | Blog post title                    |
| **Slug**           | Rich Text     | URL slug (e.g., "my-awesome-post") |
| **Excerpt**        | Rich Text     | Short description                  |
| **Category**       | Select        | Post category                      |
| **Tags**           | Multi-select  | Post tags                          |
| **Author**         | Person        | Post author                        |
| **Featured**       | Checkbox      | Show on homepage                   |
| **Published**      | Checkbox      | Make post live                     |
| **Published Date** | Date          | Publication date                   |
| **Cover Image**    | Files & Media | Post cover image                   |

## ✨ Features

### 🎨 Neobrutalist Design

- Bold, chunky typography with strong visual hierarchy
- High contrast colors and sharp geometric shapes
- Brutalist-inspired layouts with intentional imperfections
- Transform effects and bold borders throughout

### 📝 Notion CMS Integration

- Seamless content management through Notion
- Automatic publishing from Notion to the website
- Support for rich content including images, code blocks, and formatting
- Real-time synchronization with Notion database

### 🚀 Performance & SEO

- Static site generation with Next.js 14
- Optimized images with Next.js Image component
- SEO-friendly meta tags and Open Graph support
- Fast loading times with performance best practices

### 🌙 Modern Features

- Dark mode support with system preference detection
- Responsive design for all device sizes
- Advanced filtering and search functionality
- Social sharing capabilities

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom neobrutalist theme
- **UI Components**: shadcn/ui
- **CMS**: Notion API
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── revalidate/    # Manual cache revalidation
│   │   └── test-notion/   # Notion connection testing
│   ├── blog/              # Blog pages
│   │   ├── [slug]/        # Dynamic blog post pages
│   │   └── page.tsx       # Blog listing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── blog-*.tsx        # Blog-specific components
│   ├── debug-notion.tsx  # Development debugging
│   ├── header.tsx        # Site header
│   └── footer.tsx        # Site footer
├── lib/                  # Utility functions
│   ├── notion.ts         # Notion API integration
│   └── utils.ts          # General utilities
├── NOTION_SETUP.md       # Detailed Notion setup guide
└── README.md             # This file
```

## 🔧 Development

### Debug Mode

The template includes debugging tools:

- Visit `/blog` to see the debug panel (red box)
- Check browser console for API logs
- Test Notion connection at `/api/test-notion`

### Cache Management

- Pages auto-revalidate every 60 seconds
- Manual revalidation via `/api/revalidate`
- For development: uncomment `export const dynamic = 'force-dynamic'`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

Compatible with any Next.js hosting:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 TODO List

### 🐛 Current Issues

- [ ] Fix category/tag dropdowns not populating
- [ ] Improve error handling for missing Notion data
- [ ] Add loading states for better UX

### 🎯 Core CMS Features

- [ ] **About Page**: Create dynamic about page from Notion
- [ ] **Contact Page**: Functional contact form with Notion integration
- [ ] **Pages CMS**: Support for static pages (Privacy, Terms, etc.)
- [ ] **Menu Management**: Dynamic navigation from Notion
- [ ] **Site Settings**: Global site configuration via Notion

### 📧 Contact & Forms

- [ ] Contact form with email notifications
- [ ] Newsletter signup with email service integration
- [ ] Comment system integration
- [ ] Form submissions stored in Notion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📚 Documentation

- [Notion Setup Guide](NOTION_SETUP.md) - Detailed Notion configuration
- [API Documentation](docs/api.md) - API endpoints and usage
- [Deployment Guide](docs/deployment.md) - Deployment instructions
- [Customization Guide](docs/customization.md) - How to customize the design

## 🆘 Support

Need help? Here's how to get support:

1. **Check the Issues**: Look for existing solutions
2. **Documentation**: Read the setup guides
3. **Debug Tools**: Use the built-in debug panel
4. **Create Issue**: Open a GitHub issue with details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Notion API** for the excellent CMS capabilities
- **Next.js Team** for the amazing framework
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first styling

---

**Ready to build your blog?**
👉 [Duplicate the Notion template](https://cloud24.notion.site/24307b611e30807fba0ce6e074d348ac) and start creating!

Built with ❤️ using Next.js, Notion API, and brutal design principles.

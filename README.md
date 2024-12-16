# RefVault

A video reference manager application built with Next.js, TypeScript, and Tailwind CSS. The app allows users to save and organize video references from YouTube and Vimeo.

## Current State

### Features
- Dark/Light mode with Cursor-inspired design
- Video grid layout with thumbnails
- Tags and descriptions for videos
- OpenAI integration for automatic tag generation
- Collapsible sidebar navigation
- Search functionality

### Tech Stack
- Next.js 14.2.20
- TypeScript
- Tailwind CSS
- OpenAI API Integration
- Radix UI Components

### Theme Implementation
The app uses CSS variables for theming:
```css
:root {
  --background: #ffffff;
  --background-secondary: #f9fafb;
  --text: #171717;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  --primary: #2563eb;
}
```

Dark mode colors are toggled via the `.dark` class.

### Important Components
1. `AddVideoDialog`: Handles video addition with OpenAI integration
2. `Sidebar`: Navigation component with collapsible functionality
3. `ThemeToggle`: Manages theme switching
4. Main page: Grid layout for video cards

### Environment Variables
Required environment variables:
- `NEXT_PUBLIC_OPENAI_API_KEY`: For OpenAI integration

### Known Issues
- Working on resolving remaining Tailwind CSS configuration issues
  - Fixed: Changed Tailwind directives in globals.css from @tailwind to @import to resolve VSCode errors
- Need to improve tag visibility in both themes

### Next Steps
- Fix remaining Tailwind CSS issues
- Improve mobile responsiveness
- Add video collections feature
- Implement user authentication

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` and add OpenAI API key:
```
NEXT_PUBLIC_OPENAI_API_KEY=your_key_here
```

3. Run development server:
```bash
npm run dev
```

## Important Files
- `src/app/page.tsx`: Main page component
- `src/components/add-video-dialog.tsx`: Video addition dialog
- `src/components/sidebar.tsx`: Navigation sidebar
- `src/components/theme-toggle.tsx`: Theme switcher
- `src/app/globals.css`: Global styles and theme variables
- `tailwind.config.ts`: Tailwind configuration
- `postcss.config.js`: PostCSS configuration

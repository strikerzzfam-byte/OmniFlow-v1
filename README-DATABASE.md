# OmniFlow Database Modules

## Setup

1. **Install Dependencies**
   ```bash
   npm install drizzle-orm @neondatabase/serverless drizzle-kit dotenv
   ```

2. **Configure Environment**
   Add your Neon database URL to `.env.local`:
   ```
   DATABASE_URL=your_neon_database_url_here
   ```

3. **Generate and Push Schema**
   ```bash
   npm run db:generate
   npm run db:push
   ```

## Module 1: OmniWrite (✅ Implemented)

**Location**: `src/db/schema/omniwrite.ts` & `src/db/modules/omniwrite.ts`

**Tables**:
- `documents` - Main document storage
- `document_versions` - Version history
- `comments` - Document comments
- `document_collaborators` - Collaboration permissions

**Service**: `OmniWriteService` with CRUD operations for all tables

## Module 2: OmniDesign (Pending)

**Tables to implement**:
- `design_projects` - Canvas projects
- `design_elements` - Canvas shapes/elements
- `project_versions` - Design history
- `project_collaborators` - Design collaboration
- `user_design_preferences` - User preferences

## Module 3: OmniGenerate (Pending)

**Tables to implement**:
- `generated_content_entries` - AI generations
- `content_variants` - Generated variants
- `generation_history` - Generation tracking

## Common Tables

**Users**: `src/db/schema/users.ts` (✅ Implemented)
- Central user management for all modules

## Usage Example

```typescript
import { OmniWriteService } from '@/db/modules';

const omniWrite = new OmniWriteService();

// Create document
const doc = await omniWrite.createDocument({
  userId: 'user-id',
  title: 'My Document',
  contentHtml: '<p>Hello World</p>'
});

// Get user documents
const docs = await omniWrite.getUserDocuments('user-id');
```

## Database Commands

- `npm run db:generate` - Generate migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:migrate` - Run migrations
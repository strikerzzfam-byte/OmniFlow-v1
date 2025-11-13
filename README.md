# OmniFlow ArcNex Core - Database Requirements

This document outlines the database storage requirements for the core functionalities of OmniFlow's `OmniWrite`, `OmniDesign`, and `OmniGenerate` tools. These requirements are inferred from the component structures and known functionalities.

## 1. OmniWrite (AI-Powered Writing Assistant)

**Core Functionality:** Rich text editing, AI writing assistance (summarize, expand, rephrase, generate outline), collaboration, document history, comments, word count, readability/SEO scores, auto-saving, local saving/exporting.

**Data to be Stored:**

*   **Documents:**
    *   `document_id` (Primary Key)
    *   `user_id` (Foreign Key - Owner)
    *   `title` (String)
    *   `content_html` (Text - stores the rich text content as HTML)
    *   `created_at` (Timestamp)
    *   `updated_at` (Timestamp - last modified)
    *   `is_auto_saving` (Boolean)
    *   `last_saved_timestamp` (Timestamp)
    *   `word_count` (Integer)
    *   `readability_score` (Integer)
    *   `seo_score` (Integer)
    *   `tone_setting` (String - e.g., "formal", "casual", "persuasive")
    *   `visibility` (String - e.g., "private", "public", "shared")

*   **Document Versions/History:**
    *   `version_id` (Primary Key)
    *   `document_id` (Foreign Key)
    *   `content_html_snapshot` (Text - snapshot of document HTML at this version)
    *   `created_at` (Timestamp)
    *   `user_id` (Foreign Key - who made the change)

*   **Comments:**
    *   `comment_id` (Primary Key)
    *   `document_id` (Foreign Key)
    *   `user_id` (Foreign Key - author of comment)
    *   `content` (Text)
    *   `target_selection` (String/JSON - indicates where the comment is in the document, e.g., character range, heading ID)
    *   `created_at` (Timestamp)

*   **Collaborators (for documents):**
    *   `document_id` (Foreign Key)
    *   `user_id` (Foreign Key)
    *   `permission_level` (String - e.g., "view", "edit", "comment")

## 2. OmniDesign (Canvas-Based Design Editor)

**Core Functionality:** Canvas-based design editor, shape manipulation (rect, circle, text, line, image), layers, properties (fill, stroke, size, position, rotation, opacity, visibility, lock status), animation, collaboration, zoom, grid, rulers, copy/paste, export.

**Data to be Stored:**

*   **Design Projects/Canvases:**
    *   `project_id` (Primary Key)
    *   `user_id` (Foreign Key - Owner)
    *   `name` (String)
    *   `created_at` (Timestamp)
    *   `updated_at` (Timestamp - last modified)
    *   `canvas_settings` (JSON - e.g., default dimensions, background color)

*   **Design Elements/Shapes:**
    *   `element_id` (Primary Key)
    *   `project_id` (Foreign Key)
    *   `type` (String - e.g., "rect", "circle", "text", "image")
    *   `properties` (JSON - stores all Konva.js shape properties like `x`, `y`, `width`, `height`, `fill`, `stroke`, `text`, `fontSize`, `rotation`, `scaleX`, `scaleY`, `opacity`, `src` for images, `points` for lines/polygons, `visible`, `locked`, etc.)
    *   `layer_index` (Integer - for layer ordering)
    *   `created_at` (Timestamp)
    *   `updated_at` (Timestamp)

*   **Project Versions/History:**
    *   `version_id` (Primary Key)
    *   `project_id` (Foreign Key)
    *   `elements_snapshot` (JSON - snapshot of all elements at this version)
    *   `created_at` (Timestamp)
    *   `user_id` (Foreign Key - who made the change)

*   **Collaborators (for design projects):**
    *   `project_id` (Foreign Key)
    *   `user_id` (Foreign Key)
    *   `permission_level` (String - e.g., "view", "edit")

*   **User Design Preferences:** (These might be stored per user globally or per project)
    *   `user_id` (Foreign Key)
    *   `default_zoom` (Float)
    *   `grid_enabled` (Boolean)
    *   `rulers_enabled` (Boolean)
    *   `panel_visibility` (JSON - e.g., `{"layers": true, "properties": false}`)

## 3. OmniGenerate (AI Content Generation)

**Core Functionality:** AI content generation (various content types and variants), smart actions (summarize, expand, rephrase), history of generations, settings for generation (tone, length, keywords), export, send to OmniWrite/OmniDesign.

**Data to be Stored:**

*   **Generated Content Entries:**
    *   `generation_id` (Primary Key)
    *   `user_id` (Foreign Key - Owner)
    *   `content_type` (String - e.g., "blog_post", "ad_copy", "email_subject")
    *   `prompt_text` (Text - the input prompt/query for generation)
    *   `generation_settings` (JSON - settings used, e.g., `{"tone": "persuasive", "length": "long", "keywords": ["AI", "productivity"]}`)
    *   `created_at` (Timestamp)

*   **Content Variants (outputs of a generation):**
    *   `variant_id` (Primary Key)
    *   `generation_id` (Foreign Key)
    *   `variant_number` (Integer - e.g., 1, 2, 3)
    *   `content` (Text - the generated text content)
    *   `metadata` (JSON - any additional metadata about the variant, e.g., word count, sentiment score)
    *   `exported_to_omniwrite` (Boolean)
    *   `exported_to_omnidesign` (Boolean)

*   **Generation History:** (Could be combined with `Generated Content Entries` if `variants` are stored as an array within `generation_settings`)
    *   This implicitly covered by `Generated Content Entries` and `Content Variants` if structured correctly.

## Common Database Considerations

*   **User Management:** A central `users` table is required to manage user accounts, authentication, and roles across all tools.
    *   `user_id` (Primary Key)
    *   `username` (String)
    *   `email` (String)
    *   `password_hash` (String)
    *   `created_at` (Timestamp)
    *   `last_login` (Timestamp)
    *   `roles` (JSON/Array - e.g., "admin", "premium_user")

*   **Real-time Collaboration:** Given the use of `yjs` and `y-websocket` in OmniWrite and OmniDesign, a persistent storage solution for the `Y.Doc` state is crucial for collaborative editing. This would typically involve:
    *   A database that can store binary data or large text blobs.
    *   A mechanism to save and load `Y.Doc` updates/snapshots (e.g., to a `yjs_document_states` table).
    *   The `y-websocket` server would need to be configured to connect to and persist data in this database.

*   **Workspace/Project Organization:** A hierarchical structure to organize user content.
    *   `workspace_id` (Primary Key)
    *   `user_id` (Foreign Key - Owner)
    *   `name` (String)
    *   `created_at` (Timestamp)
    *   `updated_at` (Timestamp)
    *   `document_ids` (Array of Foreign Keys to `documents` table)
    *   `project_ids` (Array of Foreign Keys to `design_projects` table)
    *   `generation_ids` (Array of Foreign Keys to `generated_content_entries` table)

## Development Database Setup

For local development, you might consider:

*   **SQLite:** Simple, file-based database for quick setup and prototyping.
*   **PostgreSQL/MySQL:** More robust options that mirror production environments, allowing for easier scaling and feature development.

**Example `docker-compose.yml` (for PostgreSQL development):**

```yaml
version: '3.8'
services:
  db:
    image: postgres:13
    restart: always
    environment:
      POSTGRES_DB: omniflow_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  yjs_websocket:
    image: yjs/y-websocket:latest
    restart: always
    environment:
      PORT: 1234
    ports:
      - "1234:1234"
    command: ["--port", "1234"]

volumes:
  db_data:
```

This `README.md` provides a comprehensive overview of the database requirements for `OmniWrite`, `OmniDesign`, and `OmniGenerate`, along with considerations for common features and a basic development setup.

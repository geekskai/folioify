# Folioify Submission System (v4)

This document provides technical information about the submission system for Folioify, including the database schema, API endpoints, and frontend components.

## User Experience Features

The v4 submission system focuses on enhanced user experience with logo integration:

1. **Essential Information First**

   - Focus on only four required fields: Name, Logo URL, Description, and Resource URL
   - Two-step submission process with clear visual guidance
   - Real-time logo preview and validation

2. **Logo Integration**

   - Required logo URL field with visual validation
   - Real-time preview of how the logo will appear
   - Support for various image formats (jpeg, jpg, gif, png, svg, webp)

3. **Progressive Submission Process**

   - Step 1: Core information (name, logo, description, URL)
   - Step 2: Optional enhancements (type, features, contact details)
   - Visual progress indicator shows users where they are in the process
   - Clear validation to prevent form errors

4. **Mobile-First Design**
   - Responsive layout optimized for all devices
   - Touch-friendly targets for mobile users
   - Efficient vertical space usage

## Implementation Status

All major v4 features have been successfully implemented as of 2024:

| Feature                      | Status      | Date Completed |
| ---------------------------- | ----------- | -------------- |
| Two-step submission process  | ✅ Complete | 2024/06        |
| Logo validation and preview  | ✅ Complete | 2024/06        |
| Mobile-first responsive UI   | ✅ Complete | 2024/06        |
| Form validation with Zod     | ✅ Complete | 2024/06        |
| Real-time character counting | ✅ Complete | 2024/06        |
| Backend database integration | ✅ Complete | 2024/06        |

### Implementation Changelog

**2024-06-XX: v4.0.0 Release**

- Added logo URL validation with real-time preview
- Implemented two-step submission process with progress indicator
- Enhanced mobile responsiveness
- Added visual feedback for validation states
- Integrated character counting for description fields
- Fixed client-side Image validation using window.Image()

## Database Schema

The submission system uses Supabase as its backend database. Below is a detailed breakdown of the database tables and their relationships.

### Core Tables

#### `submissions`

This is the primary table that stores all submissions regardless of category type.

| Field         | Type                    | Description                                                 |
| ------------- | ----------------------- | ----------------------------------------------------------- |
| id            | uuid                    | Primary key (generated with uuid_generate_v4())             |
| title         | text                    | Name of the submitted resource                              |
| logo_url      | text                    | URL to the resource's logo (required in v4)                 |
| description   | text                    | Brief description of the submitted resource                 |
| url           | text                    | URL to the resource                                         |
| email         | text                    | Optional email address for contact                          |
| status        | text                    | Status of the submission: 'pending', 'approved', 'rejected' |
| category_type | text                    | Type of submission: 'ai_tools' or 'mcp_servers'             |
| submitted_by  | uuid                    | Foreign key reference to auth.users (optional)              |
| created_at    | timestamp with timezone | Creation timestamp                                          |
| updated_at    | timestamp with timezone | Last update timestamp                                       |

#### `ai_tools_submissions`

This table stores additional information specific to AI Tools submissions.

| Field         | Type   | Description                                                                   |
| ------------- | ------ | ----------------------------------------------------------------------------- |
| id            | uuid   | Primary key, also foreign key to submissions.id                               |
| tool_type     | text   | Type of AI tool (optional): 'saas', 'api', 'open_source', 'browser_extension' |
| pricing_model | text   | Optional pricing model: 'free', 'freemium', 'paid', 'enterprise'              |
| features      | text[] | Array of feature identifiers                                                  |

#### `mcp_servers_submissions`

This table stores additional information specific to MCP Servers submissions.

| Field             | Type | Description                                     |
| ----------------- | ---- | ----------------------------------------------- |
| id                | uuid | Primary key, also foreign key to submissions.id |
| server_type       | text | Type of MCP server (optional)                   |
| github_url        | text | Optional GitHub repository URL                  |
| documentation_url | text | Optional documentation URL                      |
| version           | text | Optional version number of the server           |

### Relationships

- `ai_tools_submissions.id` → `submissions.id` (one-to-one)
- `mcp_servers_submissions.id` → `submissions.id` (one-to-one)
- `submissions.submitted_by` → `auth.users.id` (many-to-one)

## API Workflow

### Two-Step Submission Process

1. **Step 1 - Core Information Entry**

   - User selects a category type (AI Tool or MCP Server)
   - User enters required fields: Name, Logo URL, Description, Resource URL
   - System validates entries, particularly the logo image
   - User proceeds to step 2

2. **Step 2 - Optional Details Entry**

   - User can add category-specific optional information
   - User can skip this step and submit with just core information
   - All entries are validated before final submission

3. **Submission Processing**
   - A record is created in the `submissions` table with required fields
   - Based on the category type, a record is created in the corresponding specific table
   - Both operations are performed in a transaction to ensure data integrity

### Submission Status

The `status` field in the `submissions` table tracks the review state:

- `pending`: Initial state when a submission is first created
- `approved`: When the submission has been reviewed and approved by an admin
- `rejected`: When the submission has been reviewed and rejected by an admin

## Frontend Components

The submission system consists of the following key components:

- `SubmitModalTrigger`: Entry point for the submission system, renders a responsive modal
- `SubmitProvider`: Context provider for sharing submission state across components
- `CategorySelector`: Enhanced visual selector for choosing resource type
- `AIToolsForm`: Two-step form for AI tools with logo preview
- `MCPServersForm`: Two-step form for MCP servers with logo preview

## Form Validation

Form validation uses Zod schemas with updated requirements:

- `commonFieldsSchema`: Validates essential fields (name, logo_url, description, URL)
- `aiToolsSchema`: Validates AI tool-specific fields (all optional except core fields)
- `mcpServersSchema`: Validates MCP server-specific fields (all optional except core fields)

### Validation Implementation Details

The validation system includes specialized handling for image URLs:

```typescript
logo_url: z.string()
  .url({ message: "Please enter a valid Logo URL." })
  .refine(
    (url) => {
      if (!url) return false;
      return url.match(/\.(jpeg|jpg|gif|png|svg|webp|ico)(\?.*)?$/i) !== null;
    },
    {
      message:
        "Please provide a valid image URL (.jpg, .png, .svg, .gif, .webp, .ico)",
    }
  );
```

This ensures users can only submit valid image URLs with proper extensions.

## Logo Validation Features

The v4 system includes specialized logo handling:

1. **URL Validation**

   - Checks if the URL has a valid image file extension
   - Tests if the image can be loaded successfully
   - Provides real-time feedback on validation status

2. **Preview Functionality**

   - Shows how the logo will appear in listings
   - Proper aspect ratio preservation
   - Loading state during image validation

3. **Error Handling**
   - Clear error messages for invalid image URLs
   - Visual indicators for validation status
   - Prevents form submission until a valid logo is provided

### Technical Implementation

The logo validation uses a combination of client-side approaches:

1. **Server-side validation** using Zod schema rules
2. **Client-side pattern matching** to verify image URL extensions
3. **Dynamic image loading test** using `window.Image()` constructor:

```typescript
// Proper implementation to validate if an image URL is valid
const validateLogo = async () => {
  if (!logoUrl) {
    setIsLogoValid(false);
    return;
  }

  // Check URL format first
  if (!logoUrl.match(/\.(jpeg|jpg|gif|png|svg|webp|ico)(\?.*)?$/i)) {
    setIsLogoValid(false);
    return;
  }

  setIsLogoLoading(true);

  // Attempt to load the image
  const img = new window.Image();
  img.onload = () => {
    setIsLogoValid(true);
    setIsLogoLoading(false);
  };

  img.onerror = () => {
    setIsLogoValid(false);
    setIsLogoLoading(false);
  };

  img.src = logoUrl;
};
```

## Best Practices Implemented

1. **Two-Step Submission**

   - Focus on essential fields first
   - Optional fields presented after core information is captured
   - Visual progress indicator for multi-step process

2. **Visual Feedback**

   - Real-time logo preview
   - Character counters for text fields
   - Clear validation states

3. **Mobile Optimization**
   - Responsive layout for all devices
   - Touch-friendly input targets
   - Efficient use of vertical space

## Known Issues and Solutions

### Issue: Image Constructor Error

**Problem**: TypeScript errors when using `Image` constructor directly for image validation.  
**Solution**: Use `window.Image()` instead of `Image()` to avoid conflicts with Next.js Image component.

### Issue: Form Validation Timing

**Problem**: Form validation was sometimes triggered before user completed typing.  
**Solution**: Implemented proper debounce and validation timing in the form components.

### Issue: Mobile Layout Overflow

**Problem**: Content overflow issues on mobile devices with small screens.  
**Solution**: Enhanced responsive layout with proper padding and scrollable areas.

## Usage

To use the submission system in other parts of the application:

```tsx
import { SubmitModalTrigger } from "@/components/submit";

function MyComponent() {
  return (
    <div>
      <h1>Submit a Resource</h1>
      <SubmitModalTrigger />
    </div>
  );
}
```

## Category Types and Extensibility

The system is designed to be extensible for additional category types. To add a new category:

1. Add the new type to the `CategoryType` type in `SubmitContext.tsx`
2. Create a new form component following the two-step submission pattern
3. Add the new category to the `CategorySelector` with appropriate visuals
4. Create a new database table for category-specific fields
5. Add a new validation schema in `validation.ts`
6. Implement a submission function in `useSubmit.ts` with appropriate defaults

## Performance Considerations

- Form state is managed efficiently using React Hook Form
- Image validation is done both statically via URL pattern and dynamically via loading test
- All form controls are controlled components with proper validation timing
- The two-step process prevents unnecessary validation of optional fields until needed

## Future Enhancements

Potential improvements for future versions:

1. **Direct File Upload** - Allow users to upload image files directly instead of providing URLs
2. **Preview in Context** - Show how the submission will appear in actual listing context
3. **Save Draft** - Enable saving work-in-progress submissions
4. **Submission Status Tracking** - Let users check the status of their submissions
5. **Rich Text Description** - Support for formatted text in descriptions

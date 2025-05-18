# Folioify Submission System (v5)

This document provides technical information about the submission system for Folioify, including the database schema, API endpoints, and frontend components.

## User Experience Features

The v5 submission system focuses on enhanced user experience with logo integration and a simplified process:

1. **Essential Information in One Step**

   - Focus on only four required fields: Name, Logo URL, Description, and Resource URL
   - Simplified one-step submission process with clear visual guidance
   - Real-time logo preview and validation with enhanced reliability

2. **Logo Integration**

   - Required logo URL field with visual validation and enhanced error handling
   - Real-time preview of how the logo will appear
   - Support for various image formats (jpeg, jpg, gif, png, svg, webp)
   - Multiple retry attempts for improved reliability

3. **Simplified Submission Process**

   - Clear category selection with visual cards
   - Form with all fields in a single view for easier completion
   - Visual validation to prevent form errors
   - Improved error handling and user feedback

4. **Accessibility Improvements**
   - Screen reader support with aria attributes
   - Clear error messages with visual indicators
   - Keyboard navigation support
   - Focus management for better usability

## Implementation Status

All major v5 features have been successfully implemented as of 2024:

| Feature                      | Status      | Date Completed |
| ---------------------------- | ----------- | -------------- |
| Simplified one-step process  | ✅ Complete | 2024/06        |
| Enhanced logo validation     | ✅ Complete | 2024/06        |
| Improved error handling      | ✅ Complete | 2024/06        |
| Accessibility improvements   | ✅ Complete | 2024/06        |
| Mobile-first responsive UI   | ✅ Complete | 2024/06        |
| Form validation with Zod     | ✅ Complete | 2024/06        |
| Backend database integration | ✅ Complete | 2024/06        |

### Implementation Changelog

**2024-06-XX: v5.0.0 Release**

- Simplified two-step process to a single step for better UX
- Enhanced logo URL validation with retry mechanism and clearer error messages
- Improved accessibility with proper ARIA attributes and screen reader support
- Added more robust error handling for API submissions
- Enhanced mobile responsiveness with better layout
- Fixed validation timing issues for better reliability

## Database Schema

The submission system uses Supabase as its backend database. Below is a detailed breakdown of the database tables and their relationships.

### Core Tables

#### `submissions`

This is the primary table that stores all submissions regardless of category type.

| Field         | Type                    | Description                                                 |
| ------------- | ----------------------- | ----------------------------------------------------------- |
| id            | uuid                    | Primary key (generated with uuid_generate_v4())             |
| title         | text                    | Name of the submitted resource                              |
| logo_url      | text                    | URL to the resource's logo (required)                       |
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

### One-Step Submission Process

1. **Category Selection**

   - User selects a category type (AI Tool or MCP Server)
   - System displays the appropriate form based on selection

2. **Form Completion**

   - User enters all required and optional fields in a single form
   - Real-time validation provides immediate feedback
   - Logo validation checks image loading and format

3. **Submission Processing**
   - A record is created in the `submissions` table with required fields
   - Based on the category type, a record is created in the corresponding specific table
   - Both operations are performed in a transaction to ensure data integrity
   - User receives success notification or error message

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
- `AIToolsForm`: Single-step form for AI tools with logo preview
- `MCPServersForm`: Single-step form for MCP servers with logo preview
- `LogoPreview`: Shared component for logo validation and preview
- `useLogo`: Custom hook for logo validation logic

## Form Validation

Form validation uses Zod schemas with updated requirements:

- `submissionSchema`: Validates essential fields (name, logo_url, description, URL)
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

The v5 system includes enhanced logo handling:

1. **URL Validation**

   - Checks if the URL has a valid image file extension
   - Tests if the image can be loaded successfully
   - Retries failed loads automatically
   - Provides clear error messages for invalid images

2. **Preview Functionality**

   - Shows how the logo will appear in listings
   - Proper aspect ratio preservation
   - Loading state during image validation
   - Accessibility support for screen readers

3. **Error Handling**
   - Visual error alerts for invalid image URLs
   - Descriptive error messages with suggested fixes
   - Graceful fallbacks for edge cases
   - Timeout handling to prevent endless loading states

### Technical Implementation

The logo validation uses a combination of client-side approaches:

1. **Server-side validation** using Zod schema rules
2. **Client-side pattern matching** to verify image URL extensions
3. **Dynamic image loading test** with a retry mechanism:

```typescript
// Enhanced implementation to validate if an image URL is valid
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

  try {
    // Attempt to load the image with retry logic
    const img = new window.Image();

    img.onload = () => {
      setIsLogoValid(true);
      setIsLogoLoading(false);
    };

    img.onerror = () => {
      // Retry logic for failed loads
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        setTimeout(() => {
          img.src = logoUrl + "?retry=" + new Date().getTime();
        }, 500);
        return;
      }

      setIsLogoValid(false);
      setIsLogoLoading(false);
    };

    img.src = logoUrl;
  } catch (error) {
    console.error("Error during logo validation:", error);
    // Fallback for unexpected errors
    setIsLogoValid(true);
    setIsLogoLoading(false);
  }
};
```

## Best Practices Implemented

1. **User-Focused Design**

   - One-step submission for simplicity
   - Clear error messages and validation
   - Visual feedback at every step

2. **Accessibility**

   - Proper ARIA attributes
   - Screen reader support
   - Keyboard navigation
   - Clear focus management

3. **Error Handling**

   - Descriptive error messages
   - Graceful fallbacks
   - Retry mechanisms
   - Comprehensive logging

4. **Mobile Optimization**
   - Responsive layout for all devices
   - Touch-friendly input targets
   - Efficient use of vertical space

## Known Issues and Solutions

### Issue: Image Validation Reliability

**Problem**: Some valid images fail validation due to CORS or network issues.  
**Solution**: Implemented retry mechanism and timeout fallback.

### Issue: Accessibility Gaps

**Problem**: Previous version lacked proper accessibility attributes.  
**Solution**: Added ARIA attributes, screen reader text, and improved keyboard navigation.

### Issue: Form Validation Timing

**Problem**: Validation errors appeared too early or inconsistently.  
**Solution**: Improved validation timing and provided clearer feedback on validation status.

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
2. Create a new form component following the single-step submission pattern
3. Add the new category to the `CategorySelector` with appropriate visuals
4. Create a new database table for category-specific fields
5. Add a new validation schema in `validation.ts`
6. Implement a submission function in `useSubmit.ts` with appropriate defaults
7. Update the route handler in `src/app/api/submit/route.ts`

## Performance Considerations

- Form state is managed efficiently using React Hook Form
- Image validation includes retry mechanism and timeout handling
- All form controls are controlled components with proper validation timing
- The API endpoints are optimized for fast response times
- The modular architecture allows for code splitting and performance optimization

## Future Enhancements

Potential improvements for future versions:

1. **Direct File Upload** - Allow users to upload image files directly
2. **Preview in Context** - Show how the submission will appear in actual listing context
3. **Save Draft** - Enable saving work-in-progress submissions
4. **Submission Status Tracking** - Let users check the status of their submissions
5. **Rich Text Description** - Support for formatted text in descriptions
6. **Server-side Image Validation** - Implement more reliable server-side validation

## 数据库优化 (2024-07)

在项目最新迭代中，我们对 Supabase 数据库结构进行了以下优化，使其更符合业务需求：

### `ai_tools_submissions`表优化

1. **更新`tool_type`约束**：

   - 添加"other"作为有效选项，与前端表单选项保持一致
   - 设置"saas"作为默认值，确保非空
   - 修复了提交验证与数据库约束不一致的问题

2. **数据验证**：
   - 确保前端提交的`tool_type`值始终符合数据库约束
   - 在 API 层面增加了额外验证，防止空值提交

### `mcp_servers_submissions`表优化

1. **默认值设置**：

   - 为`server_type`设置"other"作为默认值
   - 确保即使前端未选择类型也能成功提交

2. **验证一致性**：
   - 统一了前后端的验证逻辑
   - 保持与`ai_tools_submissions`表相似的字段处理方式

### 全局优化

1. **时间戳处理**：

   - 为`submissions`表的`created_at`和`updated_at`字段添加了默认值
   - 添加触发器自动更新`updated_at`字段

2. **错误处理**：
   - 优化 API 错误信息，提供更明确的提示
   - 添加详细日志记录，方便调试问题

这些优化确保了数据库结构与最新的业务需求保持一致，减少了提交错误，提高了用户体验。

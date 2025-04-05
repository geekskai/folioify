// /* eslint-disable @typescript-eslint/indent */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      A_MCP_category: {
        Row: {
          id: number;
          name: string;
        };
      };
      MCP_Featured_List: {
        Row: {
          id: number;
          icon: string;
          title: string;
          count: string;
          server: string;
          descript: string;
        };
        Insert: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Update: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Relationships: [];
      };
      // 添加缺少的表定义
      MCP_AI_Note_Management: {
        Row: {
          id: number;
          icon: string;
          title: string;
          count: string;
          server: string;
          descript: string;
        };
        Insert: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Update: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Relationships: [];
      };
      MCP_Application_Integration_Tools: {
        Row: {
          id: number;
          icon: string;
          title: string;
          count: string;
          server: string;
          descript: string;
        };
        Insert: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Update: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Relationships: [];
      };
      MCP_Browser_Automation: {
        Row: {
          id: number;
          icon: string;
          title: string;
          count: string;
          server: string;
          descript: string;
        };
        Insert: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Update: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Relationships: [];
      };
      MCP_Data_and_App_Ecosystems: {
        Row: {
          id: number;
          icon: string;
          title: string;
          count: string;
          server: string;
          descript: string;
        };
        Insert: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Update: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Relationships: [];
      };
      MCP_Git_Workflow_Management: {
        Row: {
          id: number;
          icon: string;
          title: string;
          count: string;
          server: string;
          descript: string;
        };
        Insert: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Update: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Relationships: [];
      };
      MCP_Image_Generation_and_Manipulation: {
        Row: {
          id: number;
          icon: string;
          title: string;
          count: string;
          server: string;
          descript: string;
        };
        Insert: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Update: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Relationships: [];
      };
      MCP_Weather_and_Location_Data: {
        Row: {
          id: number;
          icon: string;
          title: string;
          count: string;
          server: string;
          descript: string;
        };
        Insert: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Update: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Relationships: [];
      };
      MCP_web_search: {
        Row: {
          id: number;
          icon: string;
          title: string;
          count: string;
          server: string;
          descript: string;
        };
        Insert: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Update: {
          count?: string;
          descript?: string;
          icon?: string;
          id?: number;
          server?: string;
          title?: string;
        };
        Relationships: [];
      };
      submit: {
        Row: {
          id: number;
          created_at: string;
          email: string | null;
          name: string | null;
          status: number | null;
          url: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: number;
          name?: string | null;
          status?: number | null;
          url?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: number;
          name?: string | null;
          status?: number | null;
          url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type NavigationCategory =
  Database["public"]["Tables"]["MCP_Featured_List"]["Row"];
export type Submit = Database["public"]["Tables"]["submit"]["Row"];
export type WebNavigation =
  Database["public"]["Tables"]["web_navigation"]["Row"];

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

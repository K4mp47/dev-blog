
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  content?: string;
}

export interface SidebarItem {
  title: string;
  items: Array<{
    name: string;
    locked?: boolean;
    id: string;
  }>;
}

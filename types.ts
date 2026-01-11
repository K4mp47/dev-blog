
export interface CodeFile {
  name: string;
  language: string;
  code: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  link: string;
  date: string;
  category: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  
  subtitle?: string;
  
  intro: {
    title?: string;
    content: string;
  };
  
  setup?: {
    title?: string;
    items: {
      type: 'text' | 'command';
      content: string;
    }[];
  };
  
  implementation: {
    title?: string;
    description: string;
    principles: string[];
    files: CodeFile[];
  };
  
  conclusion: {
    title?: string;
    content: string;
    author?: string;
  };
  
  relatedTutorialIds?: string[];
}

export interface SidebarItem {
  title: string;
  items: Array<{
    name: string;
    locked?: boolean;
    id: string;
  }>;
}

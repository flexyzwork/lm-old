export interface CourseResponse {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description?: string;
  category: string;
  image?: string;
  price?: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'Draft' | 'Published';
  createdAt: Date;
  sections: SectionResponse[];
}

export interface SectionResponse {
  id: string;
  courseId: string;
  title: string;
  createdAt: Date;
  chapters: ChapterResponse[];
}

export interface ChapterResponse {
  id: string;
  sectionId: string;
  title: string;
  type: 'Text' | 'Quiz' | 'Video';
  content: string;
  createdAt: Date;
}

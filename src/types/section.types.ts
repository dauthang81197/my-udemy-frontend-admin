export interface Section {
  id: string;
  title: string;
}

export interface CreateSectionRequest {
  title: string;
  courseId: string;
}

export interface UpdateSectionRequest {
  title: string;
  courseId: string;
}

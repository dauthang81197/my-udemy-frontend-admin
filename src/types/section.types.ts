export interface Section {
  id: string;
  title: string;
  sort?: number;
}

export interface CreateSectionRequest {
  title: string;
  courseId: string;
  sort?: number;
}

export interface UpdateSectionRequest {
  title: string;
  courseId: string;
  sort?: number;
}

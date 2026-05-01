import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { AxiosResponse } from "axios";
import { courseApi } from "@/api/courseApi";
import { getApiErrorMessage } from "@/utils/helpers";
import { COURSES_QUERY_KEY } from "./useCourses";
import type { Course } from "@/types/course.types";
import type { PaginatedResponse } from "@/types/api.types";

type CoursesCache = AxiosResponse<PaginatedResponse<Course>>;

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: courseApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
      message.success("Course created");
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof courseApi.update>[1];
    }) => courseApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: [COURSES_QUERY_KEY] });
      const snapshots = qc.getQueriesData<CoursesCache>({
        queryKey: [COURSES_QUERY_KEY],
      });
      snapshots.forEach(([key, old]) => {
        if (!old) return;
        qc.setQueryData<CoursesCache>(key, {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((c) => (c.id === id ? { ...c, ...data } : c)),
          },
        });
      });
      return { snapshots };
    },
    onError: (err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, old]) => qc.setQueryData(key, old));
      message.error(getApiErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] }),
    onSuccess: () => message.success("Course updated"),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: courseApi.delete,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [COURSES_QUERY_KEY] });
      const snapshots = qc.getQueriesData<CoursesCache>({
        queryKey: [COURSES_QUERY_KEY],
      });
      snapshots.forEach(([key, old]) => {
        if (!old) return;
        qc.setQueryData<CoursesCache>(key, {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((c) => c.id !== id),
            totalItems: old.data.totalItems - 1,
          },
        });
      });
      return { snapshots };
    },
    onError: (err, _id, ctx) => {
      ctx?.snapshots.forEach(([key, old]) => qc.setQueryData(key, old));
      message.error(getApiErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] }),
    onSuccess: () => message.success("Course deleted"),
  });
}

export function usePublishCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseApi.publish(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [COURSES_QUERY_KEY] });
      const snapshots = qc.getQueriesData<CoursesCache>({
        queryKey: [COURSES_QUERY_KEY],
      });
      snapshots.forEach(([key, old]) => {
        if (!old) return;
        qc.setQueryData<CoursesCache>(key, {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((c) =>
              c.id === id ? { ...c, isPublished: true } : c,
            ),
          },
        });
      });
      return { snapshots };
    },
    onError: (err, _id, ctx) => {
      ctx?.snapshots.forEach(([key, old]) => qc.setQueryData(key, old));
      message.error(getApiErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] }),
    onSuccess: () => message.success("Course published"),
  });
}

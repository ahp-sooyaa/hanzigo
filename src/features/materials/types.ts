export type MaterialFilter = "all" | "documents" | "links";
export type MaterialSort = "newest" | "oldest";

export interface MaterialListQueryParams {
  q?: string;
  type?: MaterialFilter;
  sort?: MaterialSort;
}

export type StudentMaterialsQueryParams = MaterialListQueryParams;
export type TeacherMaterialsQueryParams = MaterialListQueryParams;

const FILTER_VALUES: MaterialFilter[] = ["all", "documents", "links"];
const SORT_VALUES: MaterialSort[] = ["newest", "oldest"];

export function parseMaterialFilter(value?: string): MaterialFilter {
  if (value && FILTER_VALUES.includes(value as MaterialFilter)) {
    return value as MaterialFilter;
  }

  return "all";
}

export function parseMaterialSort(value?: string): MaterialSort {
  if (value && SORT_VALUES.includes(value as MaterialSort)) {
    return value as MaterialSort;
  }

  return "newest";
}

export function parseMaterialListQueryParams(params: {
  q?: string;
  filter?: string;
  type?: string;
  sort?: string;
}): Required<MaterialListQueryParams> {
  const typeValue = params.type ?? params.filter;

  return {
    q: params.q?.trim() ?? "",
    type: parseMaterialFilter(typeValue),
    sort: parseMaterialSort(params.sort),
  };
}

export function parseStudentMaterialsQueryParams(params: {
  q?: string;
  filter?: string;
  type?: string;
  sort?: string;
}): Required<StudentMaterialsQueryParams> {
  return parseMaterialListQueryParams(params);
}

export function parseTeacherMaterialsQueryParams(params: {
  q?: string;
  filter?: string;
  type?: string;
  sort?: string;
}): Required<TeacherMaterialsQueryParams> {
  return parseMaterialListQueryParams(params);
}

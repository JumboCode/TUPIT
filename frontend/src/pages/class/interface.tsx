
export interface SearchOptionInterface {
  course_title: string | Set<string>;
  department: string | Set<string>;
}

export interface SearchBoxInterface {
    boxName: string;
    boxKey: string;
    boxValue: Set<string>;
    handleQuery: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
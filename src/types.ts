export interface EntryData {
  name: string;
  path: string;
  size: number;
  extension: string;
  createdDate: Date;
  isDirectory: boolean;
  link: string;
  children?: EntryData[];
  hasChildren?: boolean;
}

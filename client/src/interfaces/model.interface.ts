export interface IFiles {
  Key: string,
  Size: number,
  LastModified?: Date,
  isDirectory?: boolean,
}

export interface ISelectedFiles {
  local: Array<string>,
  remote: Array<string>,
}

export interface IProgress {
  current: number,
  total: number,
}
export interface ITask {
  action: string,
  item: IFiles,
  progress?: IProgress,
  process?: string,
  error?: any,
  end?: boolean,
  id?: string,
}

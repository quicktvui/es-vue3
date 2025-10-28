export interface ESRequestPermissionsResult {
  readonly granted: boolean
  readonly grantedList?: Array<string>
  readonly deniedList?: Array<string>
  readonly deniedForeverList?: Array<string>
}



export interface Root {
  isValid: boolean
  successMessages: any
  errorMessages: any
  data: Data
}

export interface Data {
  inventoryItems: InventoryItem[]
  result: any
  count: number
}

export interface InventoryItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  inventoryValue: number
  createdByEmp: CreatedByEmp
  createdBy: string
  createdOn: string
  modifiedOn: string
  modifiedBy: any
  isDeleted: boolean
}
export interface PoInventoryItemDto {
  id: string
  price: number
  quantity: number
}
export interface CreatedByEmp {
  id: string
  firstName: string
  lastName: string
  middleName: string
  profilePhotoName: any
  employeeCode: string
  officeEmailId: string
  officeContactNo: string
  joiningOn: string
  confirmationOn: any
  resignationOn: any
  relievingOn: any
  designationId: string
  reportingToId: any
  departmentId: any
  employeePersonalDetail: any
  employeeBankDetail: any
  user: any
  designation: any
  reportingTo: any
  department: any
  employeeEducationDetails: any
  employeeDocuments: any
  reportingTos: any
  createdBy: string
  createdOn: string
  modifiedOn: any
  modifiedBy: any
  isDeleted: boolean
}

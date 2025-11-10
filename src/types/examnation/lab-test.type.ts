
import { LabTestOrderStatus } from "./enums/lab-test-order-status.enum"
import { LabTestType } from "./enums/lab-test-type.enum"
import { CreateLabTestOrderPayload, CreateLabTestResultPayload } from "./lab-test-dto"
import { VitalSigns } from "./vital-sign.type"

export interface LabTest {
    id: string
    name: string
    code?: string
    description?: string
    price: number
    isActive: boolean
    type: LabTestType
    createdAt: string
    updatedAt: string
}

export interface LabTestOrder extends CreateLabTestOrderPayload {
    id: string
    patientId: string,
    patientName: string
    results?: LabTestResult
    vitalSigns?: VitalSigns[]
    createdAt: string
    updatedAt: string
}



export interface LabTestResult extends CreateLabTestResultPayload {
    id: string;
    createdAt: string;
    updatedAt: string;
}


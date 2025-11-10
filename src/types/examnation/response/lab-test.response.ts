import { AppointmentDetail } from "../../appointment/appointment.type"
import { LabTestOrderStatus } from "../enums/lab-test-order-status.enum"
import { LabTestType } from "../enums/lab-test-type.enum"
import { LabTestResult } from "../lab-test.type"
import { VitalSigns } from "../vital-sign.type"

export interface LabTestOrderResponse {
    id: string
    appointment: AppointmentDetail,
    type: LabTestType
    status: LabTestOrderStatus
    orderedBy?: string
    result?: LabTestResult
    vitalSigns?: VitalSigns[]
    createdAt: string
    updatedAt: string
}
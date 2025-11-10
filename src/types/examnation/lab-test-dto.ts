import { LabTestOrderStatus } from "./enums/lab-test-order-status.enum";
import { LabTestType } from "./enums/lab-test-type.enum";


export interface CreateLabTestOrderPayload {
    appointmentId: string;
    type: LabTestType;
    status?: LabTestOrderStatus;
    orderedBy?: string;
}

export interface CreateLabTestResultPayload {
    labTestOrderId: string;
    resultFile?: string;
    summary?: string;
    enteredBy?: string;

    // --- Các chỉ số xét nghiệm máu ---
    bloodSugar?: number;
    cholesterolTotal?: number;
    hdl?: number;
    ldl?: number;
    triglycerides?: number;
    creatinine?: number;

    // --- Các chỉ số xét nghiệm nước tiểu ---
    urineProtein?: number;
    urinePH?: number;
    urineSugar?: number;
}
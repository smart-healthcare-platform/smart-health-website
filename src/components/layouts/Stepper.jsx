import { Stepper, Step, StepLabel } from '@mui/material';

function MUIStepper({ currentStep }) {
  const steps = ['Chọn bác sĩ', 'Chọn thời gian', 'Thông tin cá nhân', 'Xác nhận'];
  return (
    <Stepper activeStep={currentStep - 1} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
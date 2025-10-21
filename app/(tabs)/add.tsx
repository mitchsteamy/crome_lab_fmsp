import React from 'react';
import { QuestionEngineProvider } from '../../contexts/QuestionEngineContext';
import QuestionFlow from '../../components/questionEngine/QuestionFlow';

// Main component with provider
export default function AddMedicationPage() {
  return (
    <QuestionEngineProvider>
      <QuestionFlow />
    </QuestionEngineProvider>
  );
}
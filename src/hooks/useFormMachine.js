import { useMachine } from "@xstate/react";

const useFormMachine = (formMachine, options = {}) => {
  const [state, send, service] = useMachine(formMachine, options);

  const fieldValue = (name) => state?.context?.values[name];
  const isFieldDisabled = (name) =>
    state.matches(`form.${name}.enable.disabled`);

  const isFieldVisible = (name) =>
    state.matches(`form.${name}.visible.visible`);

  return { state, send, service, fieldValue, isFieldDisabled, isFieldVisible };
};

export default useFormMachine;

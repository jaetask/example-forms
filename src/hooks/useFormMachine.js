import { useMachine } from "@xstate/react";

/**
 * Gets the forms state even when we're not in the form state
 * @param state
 */
const getFormStates = (state) => {
  if (state.matches("form")) {
    return state.value.form;
  }
  return state?.historyValue?.states?.form?.current;
};

const useFormMachine = (formMachine, options = {}) => {
  const [state, send, service] = useMachine(formMachine, options);

  const fieldValue = (name) => state?.context?.values[name];

  const isFieldEnabled = (name) => state.matches(`form.${name}.enable.enabled`);

  const isFieldDisabled = (name) =>
    state.matches(`form.${name}.enable.disabled`);

  const isFieldVisible = (name) => {
    const formValues = getFormStates(state);
    return formValues && formValues[name]
      ? formValues[name]?.visible === "visible"
      : true;
  };

  const isFieldValid = (name) => {
    const formValues = getFormStates(state);
    return formValues && formValues[name]
      ? formValues[name]?.valid === "valid"
      : true;
  };

  const isFieldFocused = (name) => {
    const formValues = getFormStates(state);
    return formValues && formValues[name]
      ? formValues[name]?.focus === "focused"
      : true;
  };

  // Validation.
  // if a form field does not validate then should it be in an invalid state?
  // or should a value in context.errors be enough?

  return {
    fieldValue,
    isFieldDisabled,
    isFieldEnabled,
    isFieldFocused,
    isFieldValid,
    isFieldVisible,
    send,
    service,
    state,
  };
};

export default useFormMachine;

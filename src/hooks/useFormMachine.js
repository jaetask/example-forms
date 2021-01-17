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

// 1. how much of this could be moved into the main library?
// 2. how much is implementation?
const useFormMachine = (formMachine, options = {}) => {
  const [state, send, service] = useMachine(formMachine, options);

  const { errors } = state.context;
  const hasFieldError = (name) => errors[name] !== undefined;
  const fieldError = (name) => errors[name];
  const hasErrors = Object.keys(errors).length > 0;

  // form.values = form state || historyValue if the form is in other states (e.g. submitting)
  const formValues = getFormStates(state);

  // things need to be created in this context to work corectly, but it sucks having them in here!
  const fieldValue = (name) => state?.context?.values[name];

  const isFieldEnabled = (name) => state.matches(`form.${name}.enable.enabled`);

  const isFieldDisabled = (name) =>
    state.matches(`form.${name}.enable.disabled`);

  const isFieldVisible = (name) =>
    formValues && formValues[name]
      ? formValues[name]?.visible === "visible"
      : true;

  const isFieldValid = (name) =>
    formValues && formValues[name] ? formValues[name]?.valid === "valid" : true;

  const isFieldFocused = (name) =>
    formValues && formValues[name]
      ? formValues[name]?.focus === "focused"
      : true;

  return {
    fieldError,
    fieldValue,
    hasErrors,
    hasFieldError,
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

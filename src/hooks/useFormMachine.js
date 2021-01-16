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

  const { errors } = state.context;
  const hasFieldError = (name) => errors[name] !== undefined;
  const fieldError = (name) => errors[name];
  const hasErrors = Object.keys(errors).length > 0;

  // Validation.
  // if a form field does not validate then should it be in an invalid state?
  // or should a value in context.errors be enough?

  // for now, validation is going to run on _every_ state change,
  // we can make this configurable later

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

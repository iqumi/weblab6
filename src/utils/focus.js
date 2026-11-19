export function focusFirstInvalidField(formElement) {
  const target =
    formElement.querySelector('[aria-invalid="true"]') ?? formElement.querySelector('input')
  target?.focus()
}

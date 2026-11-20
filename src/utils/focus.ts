export function focusFirstInvalidField(formElement: HTMLFormElement): void {
  const target =
    formElement.querySelector<HTMLElement>('[aria-invalid="true"]') ??
    formElement.querySelector<HTMLElement>('input')
  target?.focus()
}

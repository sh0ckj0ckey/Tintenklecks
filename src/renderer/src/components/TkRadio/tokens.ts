import type { InjectionKey, Ref } from 'vue'

export interface RadioGroupContext {
  modelValue: Ref<unknown>
  name: Ref<string>
  disabled: Ref<boolean>
  updateValue: (val: unknown) => void
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('radioGroupKey')

import { writable } from 'svelte/store'

export const currentUser = writable<object | null>()

export const welcomeMessage = writable<boolean>(false)

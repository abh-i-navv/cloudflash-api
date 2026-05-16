import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatResponseBody(response: string) {
  try {
    return JSON.stringify(JSON.parse(response), null, 2)
  } catch {
    return response
  }
}

export function getPathname(url: string) {
  try {
    const parsed = new URL(url)

    return parsed.pathname || "/"

  } catch (error) {
    return url
  }
}

export function getDomain(url: string) {
  try {
    return new URL(url).hostname
  } catch (error) {
    return url
  }
}
// src/lib/storage.ts
export const DB = {
  getStore: () => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem('pharmadesk-store')
    return data ? JSON.parse(data) : null
  },
  
  saveStore: (data: any) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('pharmadesk-store', JSON.stringify(data))
  },
  
  getInventory: () => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('pharmadesk-inventory')
    return data ? JSON.parse(data) : []
  },
  
  saveInventory: (data: any) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('pharmadesk-inventory', JSON.stringify(data))
  },

  getBills: () => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('pharmadesk-bills')
    return data ? JSON.parse(data) : []
  },

  saveBills: (data: any) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('pharmadesk-bills', JSON.stringify(data))
  }
}
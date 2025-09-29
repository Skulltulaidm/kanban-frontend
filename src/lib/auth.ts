import Cookies from 'js-cookie'

const TOKEN_KEY = 'kanban_token'

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
    }
    return null
}

export const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        Cookies.set(TOKEN_KEY, token, { expires: 30 }) // 30 días
        localStorage.setItem(TOKEN_KEY, token)
    }
}

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        Cookies.remove(TOKEN_KEY)
        localStorage.removeItem(TOKEN_KEY)
    }
}
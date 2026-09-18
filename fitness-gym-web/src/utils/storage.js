export function setStorageItem(key, value) {
    localStorage.setItem(key, value);
}

export function getStorageItem(key) {
    return localStorage.getItem(key);
}

export function removeStorageItem(key) {
    localStorage.removeItem(key);
}

export function setStorageObject(key, value) {
    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}

export function getStorageObject(key) {
    const value = localStorage.getItem(key);

    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

export function clearStorage() {
    localStorage.clear();
}
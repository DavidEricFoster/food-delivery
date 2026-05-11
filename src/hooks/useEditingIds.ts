import { useState } from 'react';

export function useEditingIds() {
    const [ids, setIds] = useState<string[]>([]);
    const add    = (id: string) => setIds((prev) => [...prev, id]);
    const remove = (id: string) => setIds((prev) => prev.filter((x) => x !== id));
    const has    = (id: string) => ids.includes(id);
    return { ids, add, remove, has };
}

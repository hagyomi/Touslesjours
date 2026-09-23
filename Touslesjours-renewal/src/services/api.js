export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
export async function request(path, options = {}) {
 const response = await fetch(API_BASE + path, {credentials:'include', ...options, headers:{'Content-Type':'application/json', ...options.headers}});
 if (!response.ok) throw new Error('요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.');
 return response.status === 204 ? null : response.json();
}

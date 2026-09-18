// Atom Blog — 日期格式化

/**
 * 中文格式化日期
 */
export function formatDateCN(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', ...options });
}

/**
 * 完整中文日期
 */
export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

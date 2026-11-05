import type { Supporter } from '@/types/content'

export const supporters: Supporter[] = [
  { name: '烦鸟', amount: 150.0 },
  { name: '冷焱', amount: 25.0 },
  { name: '一只灵物', amount: 23.6 },
  { name: '空灵苍云', amount: 15.0 },
  { name: '蛇屠王八', amount: 10.0 },
  { name: '初尘', amount: 10.0 },
  { name: '沉默是金', amount: 6.6 },
  { name: 'Chronic', amount: 6.6 },
  { name: '小莫', amount: 3.0 },
  { name: '阿狸', amount: 1.23 },
]

export const supportersTotal = supporters.reduce((sum, item) => sum + item.amount, 0)

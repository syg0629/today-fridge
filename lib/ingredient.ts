// lib/ingredient.ts

// 1) 카테고리 상수/유형
export const CATEGORY_KO = [
  "야채",
  "고기",
  "유제품",
  "조미료",
  "기타",
] as const;
export type CategoryKo = (typeof CATEGORY_KO)[number];

export const CATEGORY_ENUM = [
  "VEGETABLE",
  "MEAT",
  "DAIRY",
  "SEASONING",
  "OTHER",
] as const;
export type CategoryEnum = (typeof CATEGORY_ENUM)[number];

// 2) enum ↔ ko 매핑
export const enumToKo = {
  VEGETABLE: "야채",
  MEAT: "고기",
  DAIRY: "유제품",
  SEASONING: "조미료",
  OTHER: "기타",
} satisfies Record<CategoryEnum, CategoryKo>;

export const koToEnum = {
  야채: "VEGETABLE",
  고기: "MEAT",
  유제품: "DAIRY",
  조미료: "SEASONING",
  기타: "OTHER",
} satisfies Record<CategoryKo, CategoryEnum>;

// 3) 이모지 매핑
// - values는 string literal 유지
// - 키는 CategoryKo 전체를 만족(satisfies) → emojiByKo[category] 인덱싱 가능
export const emojiByKo = {
  야채: "🥬",
  고기: "🥩",
  유제품: "🥛",
  조미료: "🧂",
  기타: "🍳",
} satisfies Record<CategoryKo, string>;

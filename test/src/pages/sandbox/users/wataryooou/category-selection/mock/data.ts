export type Subcategory = {
  id: string;
  name: string;
  count: number;
};

export type Category = {
  id: string;
  name: string;
  count: number;
  subcategories: Subcategory[];
};

export type CategoryGroup = {
  id: string;
  name: string;
  categories: Category[];
};

export const categories: Category[] = [
  {
    id: "electronics",
    name: "家電・電化製品",
    count: 31,
    subcategories: [
      { id: "tv", name: "テレビ・映像機器", count: 8 },
      { id: "audio", name: "オーディオ", count: 5 },
      { id: "camera", name: "カメラ", count: 6 },
      { id: "pc", name: "パソコン・周辺機器", count: 7 },
      { id: "kitchen", name: "キッチン家電", count: 5 },
    ],
  },
  {
    id: "fashion",
    name: "ファッション",
    count: 39,
    subcategories: [
      { id: "mens", name: "メンズ", count: 12 },
      { id: "womens", name: "レディース", count: 15 },
      { id: "kids", name: "キッズ", count: 7 },
      { id: "bags", name: "バッグ・財布", count: 5 },
    ],
  },
  {
    id: "food",
    name: "食品・飲料",
    count: 40,
    subcategories: [
      { id: "fresh", name: "生鮮食品", count: 10 },
      { id: "processed", name: "加工食品", count: 12 },
      { id: "drinks", name: "飲料・お酒", count: 8 },
      { id: "sweets", name: "スイーツ・お菓子", count: 10 },
    ],
  },
  {
    id: "books",
    name: "本・雑誌",
    count: 26,
    subcategories: [
      { id: "novel", name: "小説・文学", count: 8 },
      { id: "comic", name: "コミック", count: 7 },
      { id: "magazine", name: "雑誌", count: 6 },
      { id: "business", name: "ビジネス書", count: 5 },
    ],
  },
  {
    id: "sports",
    name: "スポーツ・アウトドア",
    count: 32,
    subcategories: [
      { id: "golf", name: "ゴルフ", count: 8 },
      { id: "fitness", name: "フィットネス", count: 7 },
      { id: "outdoor", name: "アウトドア用品", count: 9 },
      { id: "cycling", name: "サイクリング", count: 8 },
    ],
  },
  {
    id: "beauty",
    name: "美容・コスメ",
    count: 30,
    subcategories: [
      { id: "skincare", name: "スキンケア", count: 10 },
      { id: "makeup", name: "メイクアップ", count: 8 },
      { id: "hair", name: "ヘアケア", count: 7 },
      { id: "fragrance", name: "香水・フレグランス", count: 5 },
    ],
  },
  {
    id: "interior",
    name: "インテリア・家具",
    count: 28,
    subcategories: [
      { id: "furniture", name: "家具", count: 10 },
      { id: "bedding", name: "寝具", count: 6 },
      { id: "lighting", name: "照明", count: 5 },
      { id: "storage", name: "収納用品", count: 7 },
    ],
  },
  {
    id: "toys",
    name: "おもちゃ・ゲーム",
    count: 24,
    subcategories: [
      { id: "videogame", name: "テレビゲーム", count: 8 },
      { id: "boardgame", name: "ボードゲーム", count: 5 },
      { id: "figure", name: "フィギュア", count: 6 },
      { id: "hobby", name: "ホビー", count: 5 },
    ],
  },
];

export const categoryGroups: CategoryGroup[] = [
  {
    id: "lifestyle",
    name: "ライフスタイル",
    categories: categories.filter((c) => ["electronics", "interior", "food"].includes(c.id)),
  },
  {
    id: "personal",
    name: "パーソナル",
    categories: categories.filter((c) => ["fashion", "beauty", "sports"].includes(c.id)),
  },
  {
    id: "entertainment",
    name: "エンターテインメント",
    categories: categories.filter((c) => ["books", "toys"].includes(c.id)),
  },
];

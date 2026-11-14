export interface BoxPlan {
  intervalDays: number;
  discountPercentage: number;
}

export interface BoxProduct {
  slug: string;
  name: string;
  technicalName: string;
  format: string;
  color: string;
  listPrice: number;
  plans: BoxPlan[];
}

export interface BoxFaq {
  question: string;
  answer: string;
}

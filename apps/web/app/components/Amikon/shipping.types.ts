export interface ShippingTranslation {
  title: string;
  freeShipping: string;
  sections: { title: string; text: string }[];
  paymentTitle: string;
  payment: string;
  question: string;
  quote: string;
  contact: string;
  detailsTitle: string;
  details: { title: string; text: string }[];
  payments: { title: string; text: string }[];
  request: string;
}

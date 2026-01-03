import { isBlackFriday, isHolidaySale } from "../../utils/discountDates";

export interface DiscountResult {
  discount: number;
  type: "NONE" | "VOLUME" | "BLACK_FRIDAY" | "HOLIDAY" | "LOCATION";
}

export const calculateDiscount = (
  totalQuantity: number,
  category: string[],
  location: string,
  orderDate: Date
): DiscountResult => {
  const discounts: DiscountResult[] = [];

  // Volume discount
  let volumeDiscount = 0;
  if (totalQuantity >= 50) volumeDiscount = 0.3;
  else if (totalQuantity >= 10) volumeDiscount = 0.2;
  else if (totalQuantity >= 5) volumeDiscount = 0.1;
  if (volumeDiscount > 0) {
    discounts.push({ discount: volumeDiscount, type: "VOLUME" });
  }

  // Black Friday (25%)
  if (isBlackFriday(orderDate)) {
    discounts.push({ discount: 0.25, type: "BLACK_FRIDAY" });
  }

  // Holiday sale (15% na coffee/mug)
  if (
    isHolidaySale(orderDate) &&
    (category.includes("coffee") || category.includes("mug"))
  ) {
    discounts.push({ discount: 0.15, type: "HOLIDAY" });
  }

  // Location discount
  let locationDiscount = 0;
  switch (location) {
    case "EU":
      locationDiscount = 0;
      break; // +15% VAT (no discount)
    case "ASIA":
      locationDiscount = 0.05;
      break; // -5%
    case "US":
      locationDiscount = 0;
      break;
  }
  if (locationDiscount > 0) {
    discounts.push({ discount: locationDiscount, type: "LOCATION" });
  }

  // The highest discount
  const bestDiscount: DiscountResult =
    discounts.length > 0
      ? discounts.reduce((prev, curr) =>
          curr.discount > prev.discount ? curr : prev
        )
      : ({ discount: 0, type: "NONE" } as DiscountResult);

  return bestDiscount;
};

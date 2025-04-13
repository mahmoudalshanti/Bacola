import {
  Apple,
  Beef,
  Coffee,
  Croissant,
  EggFried,
  Lollipop,
  Milk,
  Snowflake,
  TreePalm,
} from "lucide-react";

const CategoryIcon = ({
  categoryName,
  hover,
  smallSpace = false,
}: {
  categoryName: string;
  hover: string;
  smallSpace?: boolean;
}) => {
  const lowerName = categoryName.toLowerCase();

  if (lowerName.includes("fruits"))
    return (
      <Apple
        className={`${smallSpace ? "mr-2" : "mr-4 "} size-5 ${
          hover.includes("fruits") ? "text-cyan-600" : " text-slate-500"
        }`}
      />
    );
  if (lowerName.includes("meat"))
    return (
      <Beef
        className={`${smallSpace ? "mr-2" : "mr-4 "} size-5  ${
          hover.includes("meat") ? "text-cyan-600" : " text-slate-500"
        }`}
      />
    );
  if (lowerName.includes("bread"))
    return (
      <Croissant
        className={`${smallSpace ? "mr-2" : "mr-4 "} size-5  ${
          hover.includes("bread") ? "text-cyan-600" : " text-slate-500"
        }`}
      />
    );
  if (lowerName.includes("frozen"))
    return (
      <Snowflake
        className={`${smallSpace ? "mr-2" : "mr-4 "} size-5 ${
          hover.includes("frozen") ? "text-cyan-600" : " text-slate-500"
        }`}
      />
    );
  if (lowerName.includes("snacks"))
    return (
      <Lollipop
        className={`${smallSpace ? "mr-2" : "mr-4 "} size-5 ${
          hover.includes("snacks") ? "text-cyan-600" : " text-slate-500"
        }`}
      />
    );
  if (lowerName.includes("staples"))
    return (
      <TreePalm
        className={`${smallSpace ? "mr-2" : "mr-4 "} size-5 ${
          hover.includes("staples") ? "text-cyan-600" : " text-slate-500"
        }`}
      />
    );
  if (lowerName.includes("beverages"))
    return (
      <Coffee
        className={`${smallSpace ? "mr-2" : "mr-4 "} size-5 ${
          hover.includes("beverages") ? "text-cyan-600" : " text-slate-500"
        }`}
      />
    );
  if (lowerName.includes("household"))
    return (
      <Milk
        className={`${smallSpace ? "mr-2" : "mr-4 "} size-5 ${
          hover.includes("household") ? "text-cyan-600" : " text-slate-500"
        }`}
      />
    );
  if (lowerName.includes("fast"))
    return (
      <EggFried
        className={`${smallSpace ? "mr-2" : "mr-4 "} size-5  ${
          hover.includes("fast") ? "text-cyan-600" : " text-slate-500"
        }`}
      />
    );
};

export default CategoryIcon;

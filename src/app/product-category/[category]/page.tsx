import NavigationBar from "@/app/_components/NavigationBar";
import {
  actionGetCategories,
  actionGetCategoryName,
} from "@/app/dashboard/_actions/actionDashboard";
import { notFound } from "next/navigation";
import Filter from "../_components/Filter";
import { capitalizeIfAmpersand, decodeUrlString } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeUrlString(category);

  const title = `Buy Fresh ${capitalizeIfAmpersand(
    decodedCategory
  )} Online | Bacola`;
  const description = `Shop for ${capitalizeIfAmpersand(
    decodedCategory
  )} at Bacola. Fresh groceries delivered globally.`;

  return {
    title,
    description,
    keywords: [decodedCategory],
  };
}

async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  let findCategory: Category | null = null;
  let categories: Category[] = [];

  try {
    // Fetch in parallel for better performance
    [findCategory, categories] = await Promise.all([
      actionGetCategoryName(
        decodeUrlString(category).toLowerCase()
      ) as unknown as Category | null,
      actionGetCategories() as unknown as Category[],
    ]);

    if (!findCategory) {
      return notFound();
    }
    if ("errMsg" in findCategory) {
      if (findCategory.errMsg) throw new Error(findCategory.errMsg as string);
    }
  } catch (err) {
    return notFound();
  }

  return (
    <div className="py-[130px] md:p-0 mb-0 md:mb-32">
      <div className="sm:mb-10 lg:mb-14 mb-4">
        <NavigationBar
          navigation={`Category & Filter / ${capitalizeIfAmpersand(
            findCategory.name
          )} `}
        />
        <div className="mt-8 lg:mt-14">
          <Filter categories={categories} category={findCategory} />
        </div>
      </div>
    </div>
  );
}

export default Page;

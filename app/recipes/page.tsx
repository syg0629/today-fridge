import { Clock, SquareUserRound, XCircle, Star } from "lucide-react";
import { Recipe, RecipeIngredientInfo } from "@/types";
import Link from "next/link";

async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("레시피를 불러오지 못했습니다.");
  return res.json();
}

async function getUserIngredients(): Promise<RecipeIngredientInfo[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ingredients`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("재료를 불러오지 못했습니다.");

  const data = await res.json();
  const items: RecipeIngredientInfo[] = Array.isArray(data)
    ? data
    : data.items ?? [];
  return items.map((ing) => ({
    id: String(ing.id),
    name: ing.name,
    category: ing.category,
    quantity: Number(ing.quantity ?? 0),
    unit: ing.unit,
    available: ing.quantity > 0,
  }));
}

export default async function RecipeSearch() {
  const recipes = await getRecipes();
  const ingredients = await getUserIngredients();

  // 재료 보유율 계산
  const calculateAvailability = (recipe: Recipe) => {
    const availableCount = recipe.ingredients.filter((ing) => {
      return ingredients.some(
        (userIng) =>
          userIng.name.toLowerCase() === ing.name.toLowerCase() &&
          userIng.quantity > 0
      );
    }).length;

    return {
      available: availableCount,
      total: recipe.ingredients.length,
      percentage: Math.round(
        (availableCount / recipe.ingredients.length) * 100
      ),
    };
  };

  // 부족한 재료
  const getMissingIngredients = (recipe: Recipe) => {
    return recipe.ingredients.filter((ing) => {
      return !ingredients.some(
        (userIng) =>
          userIng.name.toLowerCase() === ing.name.toLowerCase() &&
          userIng.quantity > 0
      );
    });
  };

  // 보유율 높은 순으로 정렬하여 상위 3개만
  const recommendedRecipes = recipes
    .map((recipe) => ({
      ...recipe,
      availability: calculateAvailability(recipe),
      missingIngredients: getMissingIngredients(recipe),
    }))
    .sort((a, b) => b.availability.percentage - a.availability.percentage)
    .slice(0, 3);

  const getAvailabilityBadge = (percentage: number) => {
    if (percentage >= 80)
      return { text: "모두 보유!", color: "#10B981", bgColor: "#F0FDF4" };
    if (percentage >= 50)
      return {
        text: "재료가 절반만 있네요!",
        color: "#F59E0B",
        bgColor: "#FFFBEB",
      };
    return { text: "재료가 부족해요!", color: "#EF4444", bgColor: "#FEF2F2" };
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 md:pb-0">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#374151] mb-4">
            🔍 레시피 추천
          </h1>
          <p className="text-[#6B7280] text-base sm:text-lg">
            현재 보유 재료로 바로 만들 수 있는 요리들이에요!
          </p>
        </div>

        {/* 추천 레시피 카드들 */}
        {recommendedRecipes.length > 0 ? (
          <div className="space-y-6 mb-12">
            {recommendedRecipes.map((recipe, index) => {
              const badge = getAvailabilityBadge(
                recipe.availability.percentage
              );

              return (
                <Link
                  href={`/recipes/${recipe.id}`}
                  key={recipe.id}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E5E7EB] cursor-pointer hover:shadow-lg hover:border-[#10B981]/30 active:scale-[0.98] transition-all duration-200 relative overflow-hidden block"
                >
                  {/* 순위 배지 */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-[#374151] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* 추천 배지 */}
                  <div className="absolute top-4 right-4 z-10">
                    <div
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{
                        color: badge.color,
                        backgroundColor: badge.bgColor,
                      }}
                    >
                      {badge.text}
                    </div>
                  </div>

                  {/* 레시피 콘텐츠 */}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center pt-12 md:pt-0">
                    {/* 레시피 이미지 */}
                    <div className="w-full md:w-64 md:flex-shrink-0">
                      <div className="w-full h-48 md:h-56 rounded-xl bg-gray-100 overflow-hidden">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* 레시피 정보 */}
                    <div className="flex-1 space-y-4 min-w-0">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#374151] mb-2 break-words">
                          {recipe.name}
                        </h2>

                        {/* 주요 재료 */}
                        <p className="text-[#6B7280] mb-4 text-sm sm:text-base break-words">
                          <span className="font-medium">주재료:</span>{" "}
                          {recipe.ingredients
                            .slice(0, 4)
                            .map((ing) => ing.name)
                            .join(", ")}
                        </p>

                        {/* 기본 정보 */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 text-sm text-[#6B7280]">
                          <div className="flex items-center gap-1">
                            <span className="flex items-center">
                              {Array.from(
                                { length: recipe.difficulty },
                                (_, index) => (
                                  <Star
                                    key={index}
                                    size={18}
                                    className="fill-yellow-400 text-yellow-400"
                                  />
                                )
                              )}
                              <span className="ml-2">
                                {recipe.difficulty <= 2
                                  ? "쉬움"
                                  : recipe.difficulty === 3
                                  ? "보통"
                                  : "어려움"}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{recipe.cookingTime}분</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <SquareUserRound className="w-4 h-4 flex-shrink-0" />
                            <span>{recipe.userName}</span>
                          </div>
                        </div>
                      </div>

                      {/* 재료 보유 현황 */}
                      <div className="bg-[#F9FAFB] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-[#374151] text-sm sm:text-base">
                            {recipe.availability.available}/
                            {recipe.availability.total}개 재료
                          </span>
                        </div>

                        {/* 진행바 */}
                        <div className="w-full bg-[#E5E7EB] rounded-full h-3 mb-4">
                          <div
                            className="h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${recipe.availability.percentage}%`,
                              backgroundColor: "#F59E0B",
                            }}
                          ></div>
                        </div>

                        {/* 부족 재료만 표시 */}
                        {recipe.missingIngredients.length > 0 && (
                          <div className="flex gap-2">
                            <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-[#EF4444] font-medium break-words">
                              부족:{" "}
                              {recipe.missingIngredients
                                .map((ing) => ing.name)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-semibold text-[#374151] mb-2">
              레시피를 불러오는 중이에요
            </h3>
            <p className="text-[#6B7280]">잠시만 기다려주세요!</p>
          </div>
        )}

        {/* 더 많은 레시피 버튼 */}
        <div className="text-center">
          <Link
            href="/recipes/search"
            className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-5 rounded-2xl font-semibold text-base sm:text-lg lg:text-xl hover:shadow-lg active:scale-95 transition-all duration-200 inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
          >
            🔍 더 많은 레시피가 보고싶으신가요?
          </Link>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="text-center">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold text-[#374151] mb-2">
              더 정확한 추천을 위해
            </h3>
            <p className="text-[#6B7280] text-sm mb-4">
              냉장고에 재료를 더 추가하시면 맞춤 추천이 더욱 정확해져요!
            </p>
            <Link
              href="/"
              className="bg-[#F0FDF4] text-[#10B981] px-4 py-2 rounded-lg font-medium hover:bg-[#DCFCE7] transition-colors inline-block"
            >
              냉장고 관리하러 가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

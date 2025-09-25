// app/api/ingredients/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enumToKo, koToEnum, emojiByKo } from "@/lib/ingredient";
import { ymd, calcDaysLeft } from "@/utils/date";
import { PrismaIngredient } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 해당 사용자의 재료만 가져오기
    const rows = (await prisma.ingredient.findMany({
      where: { userId: userId },
      orderBy: [{ expiresAt: "asc" }, { createdAt: "desc" }],
    })) as PrismaIngredient[];
    const today = new Date();

    const items = rows.map((r) => {
      const catKo = enumToKo[r.category] ?? "기타";
      return {
        id: r.id,
        name: r.name,
        category: catKo,
        quantity: r.quantity ?? 1,
        unit: r.unit,
        purchaseDate: ymd(r.purchasedAt ?? null),
        expiryDate: ymd(r.expiresAt ?? null),
        daysLeft: calcDaysLeft(today, r.expiresAt ?? null),
        emoji: emojiByKo[catKo] ?? "🍳",
      };
    });

    return NextResponse.json({ items });
  } catch (e) {
    console.error("[GET /api/ingredients]", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = user.id;

    const body = (await req.json()) as {
      name: string;
      category: "야채" | "고기" | "유제품" | "조미료" | "기타";
      quantity: number;
      unit: string;
      purchaseDate?: string;
      expiryDate?: string;
    };

    if (!body?.name || !body?.category || !body?.unit || !body?.quantity) {
      return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
    }

    const catEnum = koToEnum[body.category] ?? "OTHER";
    const purchasedAt = body.purchaseDate ? new Date(body.purchaseDate) : null;
    const expiresAt = body.expiryDate ? new Date(body.expiryDate) : null;

    const created = (await prisma.ingredient.create({
      data: {
        name: body.name.trim(),
        category: catEnum,
        quantity: Number(body.quantity),
        unit: body.unit.trim(),
        purchasedAt,
        expiresAt,
        userId: userId,
      },
    })) as PrismaIngredient;

    const catKo = enumToKo[created.category] ?? "기타";
    const today = new Date();
    const item = {
      id: created.id,
      name: created.name,
      category: catKo,
      quantity: created.quantity ?? 1,
      unit: created.unit,
      purchaseDate: ymd(created.purchasedAt ?? null),
      expiryDate: ymd(created.expiresAt ?? null),
      daysLeft: calcDaysLeft(today, created.expiresAt ?? null),
      emoji: emojiByKo[catKo] ?? "🍳",
    };

    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error("[POST /api/ingredients]", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

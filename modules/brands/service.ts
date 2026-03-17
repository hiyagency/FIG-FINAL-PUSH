import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  brandDnaSchema,
  createBrandSchema,
  type BrandDnaInput,
  type CreateBrandInput
} from "@/modules/brands/schemas";

export async function createBrand(
  workspaceId: string,
  createdById: string,
  input: CreateBrandInput
) {
  const data = createBrandSchema.parse(input);

  return prisma.brand.create({
    data: {
      workspaceId,
      createdById,
      slug: data.slug,
      name: data.name,
      niche: data.niche,
      offerType: data.offerType,
      targetAudience: data.targetAudience,
      postingLanguage: data.postingLanguage,
      dnaProfile: {
        create: {
          brandName: data.name,
          niche: data.niche,
          offerType: data.offerType,
          targetAudience: data.targetAudience,
          postingLanguages: [data.postingLanguage]
        }
      }
    },
    include: {
      dnaProfile: true
    }
  });
}

export async function upsertBrandDna(brandId: string, input: BrandDnaInput) {
  const data = brandDnaSchema.parse(input);
  const jsonSafeData = {
    ...data,
    subtitleStyle: data.subtitleStyle as Prisma.InputJsonValue | undefined,
    fontPreferences: data.fontPreferences as Prisma.InputJsonValue | undefined,
    colorPalette: data.colorPalette as Prisma.InputJsonValue | undefined,
    approvalRules: data.approvalRules as Prisma.InputJsonValue | undefined
  };

  return prisma.brandDnaProfile.upsert({
    where: { brandId },
    create: {
      brandId,
      ...jsonSafeData
    },
    update: {
      ...jsonSafeData
    }
  });
}

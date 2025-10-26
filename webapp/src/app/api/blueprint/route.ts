import { NextRequest, NextResponse } from "next/server";
import {
  BlueprintRequestBody,
  generateBlueprint,
  featureDefinitions,
} from "@/lib/blueprint";

function validatePayload(payload: BlueprintRequestBody) {
  const errors: string[] = [];

  if (!payload.projectName?.trim()) {
    errors.push("Project name is required.");
  }

  if (!payload.features || payload.features.length === 0) {
    errors.push("Select at least one feature to build your plan.");
  }

  const invalidFeatures =
    payload.features?.filter((feature) => !(feature in featureDefinitions)) ??
    [];

  if (invalidFeatures.length > 0) {
    errors.push(`Unsupported features: ${invalidFeatures.join(", ")}.`);
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as BlueprintRequestBody;
    const errors = validatePayload(payload);

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const blueprint = generateBlueprint(payload);
    return NextResponse.json(blueprint);
  } catch (error) {
    console.error("Blueprint generation failed", error);
    return NextResponse.json(
      {
        errors: [
          "Failed to generate blueprint. Please review your inputs and try again.",
        ],
      },
      { status: 500 }
    );
  }
}

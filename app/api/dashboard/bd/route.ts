import { NextResponse } from "next/server";
import {
  getJsonFromGitHub,
  writeJsonToGitHub,
} from "@/app/lib/github-dashboard";

interface VendorsData {
  stages: { id: string; label: string; color: string }[];
  bds: { id: string; name: string; avatar: string }[];
  vendors: {
    id: string;
    name: string;
    bdId: string;
    stage: string;
    startDate: string;
    productCount: number;
    serviceCount: number;
    notes: string;
  }[];
  updatedAt: string;
}

const FILE_PATH = "content/dashboard/vendors.json";

export async function GET() {
  try {
    const { data } = await getJsonFromGitHub<VendorsData>(FILE_PATH);
    return NextResponse.json(data);
  } catch (error) {
    console.error("BD fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch BD data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { vendorId, newStage } = body as {
      vendorId?: string;
      newStage?: string;
    };

    if (!vendorId || !newStage) {
      return NextResponse.json(
        { error: "Missing vendorId or newStage" },
        { status: 400 }
      );
    }

    const { data, sha } = await getJsonFromGitHub<VendorsData>(FILE_PATH);

    const vendorIndex = data.vendors.findIndex((v) => v.id === vendorId);
    if (vendorIndex === -1) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    const validStages = data.stages.map((s) => s.id);
    if (!validStages.includes(newStage)) {
      return NextResponse.json(
        { error: "Invalid stage" },
        { status: 400 }
      );
    }

    const vendorName = data.vendors[vendorIndex].name;
    data.vendors[vendorIndex].stage = newStage;
    data.updatedAt = new Date().toISOString();

    const stageLabel =
      data.stages.find((s) => s.id === newStage)?.label || newStage;

    await writeJsonToGitHub(
      FILE_PATH,
      data,
      sha,
      `bd: ${vendorName} → ${stageLabel}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("BD update error:", error);
    return NextResponse.json(
      { error: "Failed to update vendor" },
      { status: 500 }
    );
  }
}

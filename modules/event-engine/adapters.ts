import type { RawEventSample, RawSignalInput } from "@/lib/types";

export interface SourceAdapter {
  key: string;
  collect(sample: RawEventSample): RawSignalInput[];
}

export const mediaAdapter: SourceAdapter = {
  key: "media",
  collect(sample) {
    return sample.sourceInputs.filter((item) => item.sourceType === "MEDIA");
  }
};

export const officialAdapter: SourceAdapter = {
  key: "official",
  collect(sample) {
    return sample.sourceInputs.filter((item) => item.sourceType === "GOVERNMENT");
  }
};

export const marketAdapter: SourceAdapter = {
  key: "market",
  collect(sample) {
    return sample.sourceInputs.filter((item) => item.signalType === "MARKET");
  }
};

export const defaultAdapters = [mediaAdapter, officialAdapter, marketAdapter];

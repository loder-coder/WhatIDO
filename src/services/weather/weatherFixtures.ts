import type { KmaApiResponse } from "./weatherTypes.js";

export const mockUltraSrtNcstResponse: KmaApiResponse = {
  response: {
    header: {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE"
    },
    body: {
      items: {
        item: [
          { baseDate: "20260619", baseTime: "1400", category: "T1H", obsrValue: "34" },
          { baseDate: "20260619", baseTime: "1400", category: "REH", obsrValue: "68" },
          { baseDate: "20260619", baseTime: "1400", category: "PTY", obsrValue: "0" },
          { baseDate: "20260619", baseTime: "1400", category: "WSD", obsrValue: "2.1" }
        ]
      }
    }
  }
};

export const mockVilageFcstResponse: KmaApiResponse = {
  response: {
    header: {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE"
    },
    body: {
      items: {
        item: [
          { baseDate: "20260619", baseTime: "1100", fcstDate: "20260620", fcstTime: "1500", category: "TMP", fcstValue: "24" },
          { baseDate: "20260619", baseTime: "1100", fcstDate: "20260620", fcstTime: "1500", category: "REH", fcstValue: "55" },
          { baseDate: "20260619", baseTime: "1100", fcstDate: "20260620", fcstTime: "1500", category: "POP", fcstValue: "20" },
          { baseDate: "20260619", baseTime: "1100", fcstDate: "20260620", fcstTime: "1500", category: "PTY", fcstValue: "0" },
          { baseDate: "20260619", baseTime: "1100", fcstDate: "20260620", fcstTime: "1500", category: "SKY", fcstValue: "1" },
          { baseDate: "20260619", baseTime: "1100", fcstDate: "20260620", fcstTime: "1500", category: "WSD", fcstValue: "1.4" }
        ]
      }
    }
  }
};

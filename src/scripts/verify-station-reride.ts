/**
 * 진짜 rerideNum 출처: 서울특별시_정류소정보조회 서비스 (ID 15000303)의 getStationByUidItem 오퍼레이션
 * 실제 요청 URL: http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?arsId=...
 * (15000314의 getArrInfoByRouteAll과는 별개 API. arsId 단위 조회라 노선 전체를 보려면 정류장마다 호출 필요)
 *
 * 실행: npm run verify:station-reride -- <arsId>
 * 예: npm run verify:station-reride -- 09102
 */
import { env } from "../lib/env";
import { fetchPublicApi } from "../lib/publicApiClient";

const BASE_URL = "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid";

async function main() {
  const arsId = process.argv[2] ?? "09102";

  const { raw, parsed } = await fetchPublicApi(BASE_URL, {
    serviceKey: env.serviceKey,
    arsId,
  });

  console.log(`=== arsId=${arsId} RAW ===`);
  console.log(raw);
  console.log("\n=== PARSED ===");
  console.log(JSON.stringify(parsed, null, 2));
}

main().catch((err) => {
  console.error("정류소별 재차인원 조회 실패:", err.message);
  if (err.response) {
    console.error("=== 응답 상태 ===", err.response.status);
    console.error("=== 응답 본문 ===", err.response.data);
  }
  process.exit(1);
});

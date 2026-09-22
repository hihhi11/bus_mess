/**
 * PBI-01 검증용: 서울특별시_노선정보조회 서비스 (getStaionByRoute, 활용 ID 15000193)
 * 노선 ID -> 정류장 순번/정류소ID/명칭/ARS번호 목록 조회
 *
 * 실행: npm run verify:station
 */
import { env } from "../lib/env";
import { fetchPublicApi } from "../lib/publicApiClient";

const BASE_URL = "http://ws.bus.go.kr/api/rest/busRouteInfo/getStaionByRoute";

async function main() {
  const { raw, parsed } = await fetchPublicApi(BASE_URL, {
    serviceKey: env.serviceKey,
    busRouteId: env.busRouteId,
  });

  console.log("=== RAW XML (앞 1000자) ===");
  console.log(raw.slice(0, 1000));
  console.log("\n=== PARSED ===");
  console.log(JSON.stringify(parsed, null, 2));
}

main().catch((err) => {
  console.error("정류소 마스터 조회 실패:", err.message);
  process.exit(1);
});

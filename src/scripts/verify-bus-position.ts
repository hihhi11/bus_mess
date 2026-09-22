/**
 * PBI-02 검증용: 서울특별시_버스위치정보조회 서비스 (getBusPosByRtid, 활용 ID 15000332)
 * 노선 ID -> 차량별 위치/혼잡도(congetion) 조회
 *
 * 실행: npm run verify:position
 */
import { env } from "../lib/env";
import { fetchPublicApi } from "../lib/publicApiClient";

const BASE_URL = "http://ws.bus.go.kr/api/rest/buspos/getBusPosByRtid";

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
  console.error("버스 위치/혼잡도 조회 실패:", err.message);
  process.exit(1);
});

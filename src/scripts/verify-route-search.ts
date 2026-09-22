/**
 * 노선번호(예: 163) -> 내부 busRouteId 조회
 * 서울특별시_노선정보조회 서비스(15000193)의 getBusRouteList 오퍼레이션 사용.
 * BUS_ROUTE_ID를 아직 모를 때 가장 먼저 이 스크립트로 routeId를 확인한다.
 *
 * 실행: npm run find:route
 */
import "dotenv/config";
import { fetchPublicApi } from "../lib/publicApiClient";

const BASE_URL = "http://ws.bus.go.kr/api/rest/busRouteInfo/getBusRouteList";

async function main() {
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;
  const strSrch = process.env.BUS_ROUTE_NAME ?? "163";

  if (!serviceKey) {
    console.error("DATA_GO_KR_SERVICE_KEY가 .env에 설정되지 않았습니다.");
    process.exit(1);
  }

  const { raw, parsed } = await fetchPublicApi(BASE_URL, {
    serviceKey,
    strSrch,
  });

  console.log(`=== "${strSrch}" 검색 결과 RAW (앞 1500자) ===`);
  console.log(raw.slice(0, 1500));
  console.log("\n=== PARSED ===");
  console.log(JSON.stringify(parsed, null, 2));
  console.log(
    '\n[안내] 위 결과에서 "busRouteId" 값을 찾아 .env의 BUS_ROUTE_ID에 넣으세요.'
  );
}

main().catch((err) => {
  console.error("노선 검색 실패:", err.message);
  process.exit(1);
});

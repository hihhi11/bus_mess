/**
 * PBI-17 재검증: 서울특별시_버스도착정보조회 서비스 (ID 15000314)
 * getArrInfoByRouteAll: 노선ID 하나로 그 노선 전체 정류소의 도착예정정보를 한 번에 조회.
 * 응답의 reride_Div1/2(0=데이터없음/2=재차인원/4=혼잡도) + reride_Num1/2 필드가
 * 공식 문서에 기재된 필드임을 확인함 (data.go.kr 15000314 응답 필드표).
 *
 * 실행: npm run verify:reride
 */
import { env } from "../lib/env";
import { fetchPublicApi } from "../lib/publicApiClient";

const BASE_URL = "http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll";

async function main() {
  const { raw, parsed } = await fetchPublicApi(BASE_URL, {
    serviceKey: env.serviceKey,
    busRouteId: env.busRouteId,
  });

  const items = (parsed as any)?.ServiceResult?.msgBody?.itemList ?? [];
  const list = Array.isArray(items) ? items : [items];

  const active = list.filter((it: any) => it.busType1 !== 0 || it.busType2 !== 0 || it.vehId1 !== 0 || it.vehId2 !== 0);
  console.log(`총 정류소 ${list.length}개 / 활성(버스 잡힌) 항목 ${active.length}개\n`);

  for (const it of active) {
    console.log(
      `[${String(it.staOrd).padStart(3)}] ${it.stNm} | 1번버스 차량${it.vehId1}(${it.plainNo1?.trim() || "-"}) ${it.arrmsg1} | Div1=${it.rerdie_Div1} Num1=${it.reride_Num1} || 2번버스 차량${it.vehId2}(${it.plainNo2?.trim() || "-"}) ${it.arrmsg2} | Div2=${it.rerdie_Div2} Num2=${it.reride_Num2}`
    );
  }
}

main().catch((err) => {
  console.error("도착정보(재차인원) 조회 실패:", err.message);
  if (err.response) {
    console.error("=== 응답 상태 ===", err.response.status);
    console.error("=== 응답 본문 ===", err.response.data);
  }
  process.exit(1);
});

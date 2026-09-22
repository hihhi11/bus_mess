/**
 * PBI-16 스파이크: 국토교통부_노선별 차내 재차인원 (활용 ID 15142063)
 *
 * 주의: 이 API는 엔드포인트 URL / 요청 파라미터명 / 응답 필드 / 갱신주기가
 * data.go.kr 공개 설명만으로는 확정되지 않는다. 서비스키 발급 후 마이페이지에서
 * 내려받는 "활용자가이드 PDF"를 반드시 먼저 확인하고, 아래 BASE_URL / PARAMS를
 * 실제 스펙에 맞게 채운 뒤 실행할 것.
 *
 * 실행: npm run verify:passenger
 */
import { env } from "../lib/env";
import { fetchPublicApi } from "../lib/publicApiClient";

// TODO: 활용자가이드 PDF에서 확인한 실제 엔드포인트로 교체
const BASE_URL = process.env.PASSENGER_API_BASE_URL ?? "";

async function main() {
  if (!BASE_URL) {
    console.error(
      "[TODO] PASSENGER_API_BASE_URL이 설정되지 않았습니다.\n" +
        "data.go.kr에서 '국토교통부_노선별 차내 재차인원'(15142063) 활용자가이드 PDF를 확인한 뒤,\n" +
        ".env에 PASSENGER_API_BASE_URL과 필요한 파라미터명을 채워 넣으세요."
    );
    process.exit(1);
  }

  // data.go.kr 활용가이드 "요청변수" 표 기준 파라미터명 (2026-09 확인)
  const { raw, parsed } = await fetchPublicApi(BASE_URL, {
    serviceKey: env.serviceKey,
    pageNo: process.env.PASSENGER_PAGE_NO ?? "1",
    numOfRows: process.env.PASSENGER_NUM_OF_ROWS ?? "10",
    opr_ymd: process.env.PASSENGER_OPR_YMD ?? "20250801",
    ctpv_cd: process.env.PASSENGER_CTPV_CD ?? "29",
    sgg_cd: process.env.PASSENGER_SGG_CD ?? "29140",
    rte_id: process.env.PASSENGER_RTE_ID ?? "00000001",
    dataType: "JSON",
  });

  console.log("=== RAW (앞 1500자) ===");
  console.log(raw.slice(0, 1500));
  console.log("\n=== PARSED ===");
  console.log(JSON.stringify(parsed, null, 2));
}

main().catch((err) => {
  console.error("재차인원 조회 실패:", err.message);
  if (err.response) {
    console.error("=== 응답 상태 ===", err.response.status);
    console.error("=== 응답 본문 ===");
    console.error(err.response.data);
  }
  process.exit(1);
});

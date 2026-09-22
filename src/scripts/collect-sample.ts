/**
 * GitHub Actions에서 5분마다 실행되는 수집 스크립트.
 * config/stations.json에 지정된 정류장들에서 163번 버스의 congestion/rerideNum을 모아
 * data/samples.jsonl에 한 줄씩 append한다 (JSON Lines).
 *
 * API 실패는 정류장 단위로 격리 — 한 곳이 실패해도 나머지는 계속 수집 (PBI-04 내결함성).
 */
import * as fs from "fs";
import * as path from "path";
import { env } from "../lib/env";
import { fetchPublicApi } from "../lib/publicApiClient";

const BASE_URL = "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid";
const CONFIG_PATH = path.join(__dirname, "../../config/stations.json");
const OUTPUT_PATH = path.join(__dirname, "../../data/samples.jsonl");

interface StationConfig {
  busRouteAbrv: string;
  stations: { arsId: string; name: string }[];
}

async function collectStation(arsId: string, name: string, busRouteAbrv: string) {
  const { parsed } = await fetchPublicApi(BASE_URL, {
    serviceKey: env.serviceKey,
    arsId,
  });

  const items = (parsed as any)?.ServiceResult?.msgBody?.itemList ?? [];
  const list = Array.isArray(items) ? items : [items];
  const match = list.find((it: any) => String(it.busRouteAbrv) === busRouteAbrv);

  if (!match) {
    return { collected_at: new Date().toISOString(), arsId, stationName: name, found: false };
  }

  return {
    collected_at: new Date().toISOString(),
    arsId,
    stationName: name,
    found: true,
    arrmsg1: match.arrmsg1,
    arrmsg2: match.arrmsg2,
    congestion1: match.congestion1,
    congestion2: match.congestion2,
    rerdieDiv1: match.rerdieDiv1,
    rerdieDiv2: match.rerdieDiv2,
    rerideNum1: match.rerideNum1,
    rerideNum2: match.rerideNum2,
    vehId1: match.vehId1,
    vehId2: match.vehId2,
  };
}

async function main() {
  const config: StationConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  const lines: string[] = [];

  for (const st of config.stations) {
    try {
      const result = await collectStation(st.arsId, st.name, config.busRouteAbrv);
      lines.push(JSON.stringify(result));
      console.log(`[OK] ${st.name}(${st.arsId})`, result.found ? "수집됨" : "163번 없음(운행종료 등)");
    } catch (err: any) {
      console.error(`[FAIL] ${st.name}(${st.arsId})`, err.message);
      lines.push(JSON.stringify({ collected_at: new Date().toISOString(), arsId: st.arsId, stationName: st.name, error: err.message }));
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.appendFileSync(OUTPUT_PATH, lines.join("\n") + "\n");
  console.log(`${lines.length}건 기록 완료 → ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("수집 실행 실패:", err.message);
  process.exit(1);
});

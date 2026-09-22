import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const xmlParser = new XMLParser({ ignoreAttributes: false });

/**
 * data.go.kr / ws.bus.go.kr 계열 공공 API는 XML 응답이 기본이고,
 * 오류 시에도 200 OK + 에러 XML을 내려주는 경우가 많아 상태코드만으로 성공 여부를 판단할 수 없다.
 */
export async function fetchPublicApi(url: string, params: Record<string, string>) {
  const res = await axios.get(url, { params, timeout: 10_000, responseType: "text" });
  const parsed = xmlParser.parse(res.data);
  return { raw: res.data, parsed };
}

import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`환경변수 ${name}가 설정되지 않았습니다. .env 파일을 확인하세요 (.env.example 참고).`);
  }
  return value;
}

export const env = {
  get serviceKey(): string {
    return required("DATA_GO_KR_SERVICE_KEY");
  },
  get busRouteId(): string {
    return required("BUS_ROUTE_ID");
  },
  busRouteName: process.env.BUS_ROUTE_NAME ?? "",
};

"use server";

export const proxyUrl = async (url: string, responseType = "text", options?: any) => {
  const res = await fetch(url, options);
  const functionName = responseType === "text" ? "text" : "json";
  const data = await res[functionName]();
  return data;
};

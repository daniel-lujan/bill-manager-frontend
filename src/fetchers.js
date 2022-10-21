const RESTAPI = process.env.REACT_APP_RESTAPI;

export async function fetchFile(filename) {
  const res = await fetch(`${RESTAPI}/file/${filename}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error()
  }
  return await res.blob();
}

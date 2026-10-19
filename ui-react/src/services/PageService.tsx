export interface RegisterProjectResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    owner: string;
    url: string;
    files: string[];
  };
}

export async function registerProject(
  owner: string,
  url: string,
  files: File[]
): Promise<RegisterProjectResponse> {
  const formData = new FormData();

  // Campos de texto.
  formData.append("owner", owner);
  formData.append("url", url);

  // Enviar cada archivo real.
  files.forEach((file) => {
    formData.append("files", file);
  });

  // Conservar las rutas relativas para reconstruir
  // la estructura de carpetas en el backend.
  const relativePaths = files.map(
    (file) => file.webkitRelativePath || file.name
  );

  formData.append(
    "relative_paths",
    JSON.stringify(relativePaths)
  );

  const response = await fetch(
    "/api/db/register-project",
    {
      method: "POST",
      body: formData,
    }
  );

  const result =
    (await response.json()) as RegisterProjectResponse;

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to register project."
    );
  }

  return result;
}
